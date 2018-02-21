const socket = require('../socket');
const api = require("./spotify-api");
const playbackAPI = require("./spotify-playback-api");
const states = require('./spotify-states.js');
const fs = require("fs");
const mkdirp = require('mkdirp');

const Queue = require('../Queue');

/////////////////////

let queue = new Queue({
    id: "id",
});
let history = new Queue({
    id: "id",
});

let pollTimeout = 2000;

let playlist = null;

mkdirp('data');
const queueFile = 'data/snoppify-queue.json';

// load savedqueue
fs.readFile(queueFile, 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
        return;
    }
    try {
        let obj = JSON.parse(data);

        obj.forEach(function(track) {
            queue.add(track);
        });
    } catch (e) {
        console.log(e);
        return;
    }
});

api.onload.then(function(data) {
    reloadPlaylist();

    if (api.config.refresh_token) {
        setInterval(function() {
            pollPlayerStatus();
        }, pollTimeout);
    }
});

states.after(function(s) {
    // clear events
    for (var ev in states.data.events) {
        states.data.events[ev] = false;
    }
});

states.on("paused", function(s) {
    console.log(s.name);
    sendEvent(s.name, {
        track: getCurrentTrack()
    });
});

states.on("playing", function(s) {
    console.log(s.name);
    sendEvent(s.name, {
        track: getCurrentTrack()
    });
});

states.on("playSong", function(s) {
    console.log(s.name);
    sendEvent(s.name, {
        track: getCurrentTrack()
    });
});

states.on("waitingForNextSong", function(s) {
    console.log(s.name);

    let track = queue.next();
    addToPlaylist(track);
    // save issuer for later
    if (track) {
        history.add(track);
        console.log(history.queue);
    }

    saveQueue();

    sendEvent(s.name, {
        track: track
    });

    if (track) {
        socket.io.local.emit("queue", {
            queue: queue.queue,
            addedTracks: [],
            removedTracks: [track],
        });
    }

    if (states.data.playlist && states.data.playlist.tracks.items.length == 0) {
        // BUG: cant start a playlist that havent been intereacted with from a spotify client,
        // for example after emptying the playlist
        //play(true);
    }
});

states.start();

module.exports = {
    get queue() {
        return queue;
    },
    get isPlaying() {
        return states.data.isPlaying;
    },
    queueTrack,
    vote,
    dequeueTrack,
    playNext,
    play,
    pause,
    next,
    previous,
    emptyPlaylist,
    emptyQueue,
    getQueue,
    getCurrentTrack,
};

//////////////////

function queueTrack(user, trackId) {
    return new Promise(function(resolve, reject) {
        api.getTracks([trackId])
            .then(r => {
                let track = r.body.tracks[0];

                if (!track) {
                    return reject({
                        response: {
                            status: 404,
                            statusText: 'Track not found'
                        }
                    });
                }

                track.snoppify = {
                    issuer: user,
                    votes: [],
                };

                // TODO: check if queue is empty and if track should be playing?
                queue.add(track);

                states.data.events.queuedTrack = true;

                states.update();

                socket.io.local.emit("queue", {
                    queue: queue.queue,
                    addedTracks: [track],
                    removedTracks: [],
                });

                saveQueue();

                resolve(track);
            })
            .catch(reject);
    });
}

function dequeueTrack(user, trackId) {
    return new Promise(function(resolve, reject) {
        // TODO: check if playing?
        let track = queue.get(trackId);

        if (!track || track.snoppify.issuer != user) {
            return reject({
                response: {
                    status: 404,
                    statusText: 'Track not found'
                }
            });
        }

        if (!queue.remove(track)) {
            return reject({
                response: {
                    status: 500,
                    statusText: 'Track could not be removed'
                }
            });
        }

        states.data.events.dequeuedTrack = true;

        states.update();

        socket.io.local.emit("queue", {
            queue: queue.queue,
            addedTracks: [],
            removedTracks: [track],
        });

        saveQueue();

        resolve();
    });
}

function vote(user, trackId) {
    return new Promise(function(resolve, reject) {
        let track = queue.get(trackId);

        if (!track) {
            return reject({
                response: {
                    status: 404,
                    statusText: "No such track"
                }
            });
        }

        if (track.snoppify.votes.indexOf(user) != -1) {
            return reject({
                response: {
                    status: 400,
                    statusText: "You have already voted"
                }
            });
        }

        track.snoppify.votes.push(user);

        saveQueue();

        states.data.events.userVoted = true;

        states.update();

        socket.io.local.emit("queue", {
            queue: queue.queue,
            addedTracks: [],
            removedTracks: [],
        });
        sendEvent("vote", {
            track: track,
            votes: track.snoppify.votes.length,
        });
    });
}

function playNext() {
    // TODO: play track
    let track = queue.next();
    history.add(track);

    saveQueue();
}

function play(playPlaylist = false) {
    let data = {};
    if (playPlaylist) {
        data.playlist = playlist.id;
    }
    return playbackAPI.play(data);
}

function pause() {
    return playbackAPI.pause();
}

function next() {
    return playbackAPI.next();
}

function previous() {
    return playbackAPI.previous();
}

function emptyPlaylist() {
    let promises = [];
    for (let i = 0; i < playlist.tracks.items.length; i += 100) {
        let positions = playlist.tracks.items.slice(i, i + 100).map((track, _i) => i + _i);
        let p = playbackAPI.removePositionsFromPlaylist(api.config.owner, playlist.id, positions, playlist.snapshot_id);
        promises.push(p);
    }
    return Promise.all(promises).then(function() {
        reloadPlaylist();
    });
}

function emptyQueue() {
    return new Promise((resolve, reject) => {
        let removed = queue.queue;

        queue.clear();

        socket.io.local.emit("queue", {
            queue: queue.queue,
            addedTracks: [],
            removedTracks: removed,
        });

        resolve();
    });
}

function getQueue() {
    return queue.queue;
}

/////////////////////

function reloadPlaylist() {
    api.getPlaylist(api.config.owner, api.config.playlist)
        .then(function(data) {
            playlist = data.body;

            states.data.playlist = playlist;

            states.update();

        }, function(err) {
            console.log('Playlist not found');
        });
}

function addToPlaylist(track) {
    if (track) {
        let uri = typeof track == "string" ? "spotify:track:" + track : track.uri;
        playbackAPI.addToPlaylist(api.config.owner, playlist.id, [uri]).then(function() {
            console.log("queued next song: " + (track.track ? track.track.name : track));

            reloadPlaylist();
        });
    }
}

function pollPlayerStatus() {
    playbackAPI.currentlyPlaying().then(function(r) {
        let player = r.data;
        states.data.isPlaying = player.is_playing;

        // got new player
        if (!states.data.player) {
            if (player.is_playing) {
                states.data.events.startedPlaying = true;
            }
            if (!player.is_playing) {
                states.data.events.stoppedPlaying = true;
            }
            states.data.changedTrack = true;
        } else {
            // started/stopped playing
            if (states.data.player.is_playing != player.is_playing) {
                if (player.is_playing) {
                    states.data.events.startedPlaying = true;
                }
                if (!player.is_playing) {
                    states.data.events.stoppedPlaying = true;
                }
            }
            // changed track
            if (player.item && (!states.data.player.item || states.data.player.item.id != player.item.id)) {
                states.data.events.changedTrack = true;
            }
        }

        states.data.player = r.data;

        states.update();
    });
}

function sendEvent(type, data) {
    socket.io.local.emit("event", {
        type: type,
        data: data || {},
    });
}

function getCurrentTrack() {
    if (states.data.player && states.data.player.item) {
        console.log(states.data.player.item.name, states.data.player.item.id);
        console.log(history.get(states.data.player.item));
        return history.get(states.data.player.item) || states.data.player.item;
    }
    return null;
}

function saveQueue() {
    let json = JSON.stringify(queue.queue);
    fs.writeFile(queueFile, json, 'utf8', function(err) {
        if (err) {
            console.log(err);
        }
    });
}