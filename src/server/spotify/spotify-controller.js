const socket = require('../socket');
const api = require("./spotify-api");
const playbackAPI = require("./spotify-playback-api");

const Queue = require('../Queue');
const StateMachine = require('../StateMachine');

let stateData = {
    isPlaying: false,
    //track: null,
    player: null,
    events: {
        queuedTrack: false,
        dequeuedTrack: false,
        changedTrack: false,
        startedPlaying: false,
        stoppedPlaying: false,
    },
}

let stateMachine = new StateMachine({
    states: [{
        name: "paused",
    }, {
        name: "playing"
    }, {
        name: "playSong"
    }, {
        name: "waitingForNextSong"
    }],
    transitions: [
        // paused
        {
            source: "paused",
            target: "playSong",
            value: function(d) {
                return d.events.changedTrack;
            }
        }, {
            source: "paused",
            target: "playing",
            value: function(d) {
                return d.isPlaying && !d.events.changedTrack;
            }
        }, {
            source: "paused",
            target: "waitingForNextSong",
            value: function(d) {
                return d.events.queuedTrack && d.playlist && d.playlist.tracks.items.length == 0;
            }
        },
        // playing
        {
            source: "playing",
            target: "paused",
            value: function(d) {
                return d.events.stoppedPlaying;
            }
        }, {
            source: "playing",
            target: "playSong",
            value: function(d) {
                return d.events.changedTrack;
            }
        }, {
            source: "playing",
            target: "waitingForNextSong",
            value: function(d) {
                return d.player.is_playing && d.player.item && (
                    (d.player.item.duration_ms - d.player.progress_ms) / 1000 < nextTrackThreshold
                );
            }
        },
        // playSong
        {
            source: "playSong",
            target: "playing",
            value: function(d) {
                return d.isPlaying;
            }
        },
        // waitingForNextSong
        {
            source: "waitingForNextSong",
            target: "playSong",
            value: function(d) {
                return d.events.changedTrack;
            }
        }, {
            source: "waitingForNextSong",
            target: "paused",
            value: function(d) {
                return !d.isPlaying;
            }
        }
    ],
    initialState: "paused",
    //finalState: "waitingForNextSong",
});

stateMachine.after(function(s) {
    // clear events
    for (var ev in stateData.events) {
        stateData.events[ev] = false;
    }
});

stateMachine.on("paused", function(s) {
    console.log(s.name);
    sendEvent(s);
});

stateMachine.on("playing", function(s) {
    console.log(s.name);
    sendEvent(s);
});

stateMachine.on("playSong", function(s) {
    console.log(s.name);
    sendEvent(s);
});

stateMachine.on("waitingForNextSong", function(s) {
    console.log(s.name);
    sendEvent(s);
    addToPlaylist(queue.next());
});

stateMachine.start();

module.exports = {
    get queue() {
        return queue;
    },
    get isPlaying() {
        return stateData.isPlaying;
    },
    queueTrack,
    dequeueTrack,
    playNext,
    play,
    pause,
    next,
    previous,
    emptyPlaylist,
};

let queue = new Queue({
    id: "id",
});
let history = new Queue({
    id: "id",
});

let pollTimeout = 2000;
let nextTrackThreshold = 10;

let playlist = null;

api.onload.then(function(data) {
    reloadPlaylist();

    if (api.config.refresh_token) {
        setInterval(function() {
            pollPlayerStatus();
        }, pollTimeout);
    }
});

function queueTrack(song) {
    // TODO: check if queue is empty and if song should be playing?
    queue.add(song);

    stateData.events.queuedTrack = true;

    updateStateMachine();
}

function dequeueTrack(song) {
    // TODO: check if playing?
    let item = queue.remove(song);
    if (item) {
        stateData.events.dequeuedTrack = true;
    }
}

function playNext() {
    // TODO: play song
    let song = queue.next();
    history.add(song);
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

/////////////////////

function reloadPlaylist() {
    api.getPlaylist(api.config.owner, api.config.playlist)
        .then(function(data) {
            playlist = data.body;

            stateData.playlist = playlist;

            updateStateMachine();

        }, function(err) {
            console.log('Playlist not found');
        });
}

function addToPlaylist(track) {
    if (track) {
        let uri = track.track ? track.track.uri : "spotify:track:" + track;
        playbackAPI.addToPlaylist(api.config.owner, playlist.id, [uri]).then(function() {
            console.log("queued next song: " + (track.track ? track.track.name : track));

            reloadPlaylist();
        });
    }
}

function pollPlayerStatus() {
    playbackAPI.currentlyPlaying().then(function(r) {
        let player = r.data;
        stateData.isPlaying = player.is_playing;

        // got new player
        if (!stateData.player) {
            if (player.is_playing) {
                stateData.events.startedPlaying = true;
            }
            if (!player.is_playing) {
                stateData.events.stoppedPlaying = true;
            }
            stateData.changedTrack = true;
        } else {
            // started/stopped playing
            if (stateData.player.is_playing != player.is_playing) {
                if (player.is_playing) {
                    stateData.events.startedPlaying = true;
                }
                if (!player.is_playing) {
                    stateData.events.stoppedPlaying = true;
                }
            }
            // changed track
            if (player.item && (!stateData.player.item || stateData.player.item.id != player.item.id)) {
                stateData.events.changedTrack = true;
            }
        }

        stateData.player = r.data;

        updateStateMachine();
    });
}

function updateStateMachine() {
    stateMachine.update(stateData);
}

function sendEvent(state) {
    socket.io.local.emit("event", {
        type: state.name,
    });
}