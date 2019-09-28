let axios = require("axios");
let SpotifyWebApi = require('spotify-web-api-node');

// let api = require("./spotify-api");

const scopes = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-library-read",
    "user-library-modify",
    "user-read-private",
    "user-read-birthdate",
    "user-read-email",
    "user-follow-read",
    "user-follow-modify",
    "user-top-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
];

let accessToken = null;
let refreshTime = 0;
let expireTime = 3600 / 2;
let api;

module.exports = {
    init,
    scopes,
    getRefreshToken,
    getAuthUrl,
    play,
    pause,
    next,
    previous,
    addToPlaylist,
    currentlyPlaying,
    removePositionsFromPlaylist,
    setActiveDevice,
    getDevices,
};

function init(_api) {
    api = _api;
}

function play(opts = {}) {
    let data = {};
    if (opts.playlist) {
        data.context_uri = "spotify:playlist:" + opts.playlist;
    }
    if (typeof opts.uris != "undefined") {
        data.uris = opts.position;
    }
    if (typeof opts.position != "undefined") {
        data.offset = {
            position: opts.position,
        };
    }
    return request("put", "me/player/play", data);
}

function pause() {
    return request("put", "me/player/pause");
}

function next() {
    return request("post", "me/player/next");
}

function previous() {
    return request("post", "me/player/previous");
}

function addToPlaylist(owner, playlist, tracks) {
    return request(
        "post",
        "users/" + owner + "/playlists/" + playlist + "/tracks",
        null, {
        uris: tracks.toString(),
    },
    );
}

function removePositionsFromPlaylist(owner, playlist, positions, snapshot) {
    return request(
        "delete",
        "users/" + owner + "/playlists/" + playlist + "/tracks", {
        positions: positions,
        snapshot_id: snapshot,
    },
    );
}

function currentlyPlaying() {
    return request("get", "me/player");
}

function setActiveDevice(id) {
    return request("put", "me/player", {
        "device_ids": [id]
    });
}

function getDevices() {
    return request("get", "me/player/devices");
}

///////////////////////

function getAccessToken() {
    return new Promise(function(resolve, reject) {
        let time = (Date.now() - refreshTime) / 1000;
        if (time < expireTime) {
            resolve(accessToken);
        } else {
            if (!api.config || !api.config.refresh_token || !api.config.access_token) {
                reject();
                return;
            }
            axios({
                method: "post",
                url: "https://accounts.spotify.com/api/token",
                params: {
                    grant_type: "refresh_token", // client_credentials, authorization_code or refresh_token
                    refresh_token: api.config.refresh_token,
                    redirect_uri: "http://localhost:3000",
                },
                headers: {
                    Authorization: "Basic " + api.config.auth_token,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
                .then(function(r) {
                    accessToken = r.data.access_token;
                    resolve(accessToken);
                }, function(r) {
                    let e = [
                        r.response.status,
                        "(" + r.response.data.error + ")",
                        r.response.data.error_description,
                    ].join(" ");
                    reject(r);
                });
        }
    });
}

function getRefreshToken(code) {
    return new Promise(function(resolve, reject) {
        axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            params: {
                grant_type: "authorization_code", // client_credentials, authorization_code or refresh_token
                code: code,
                redirect_uri: "http://localhost:3000/create-spotify-host",
            },
            headers: {
                Authorization: "Basic " + api.config.auth_token,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(function(r) {
                if (r.data && r.data.refresh_token) {
                    console.log("refresh_token", r.data.refresh_token);
                    resolve(r.data.refresh_token);
                } else {
                    resolve();
                }
            }, function(r) {
                reject(r);
            })
    });
}

function getAuthUrl(state, redirectUri) {
    api._credentials.redirectUri = redirectUri || "http://localhost:3000/create-spotify-host";

    return api.createAuthorizeURL(scopes, state || "auth");
}

function request(method, uri, data, params) {
    return new Promise(function(resolve, reject) {
        getAccessToken().then(function(token) {
            axios({
                method: method,
                url: "https://api.spotify.com/v1/" + uri,
                timeout: 10000,
                headers: {
                    Authorization: "Bearer " + token,
                },
                data: data,
                params: params,
            }).then(function(data) {
                resolve(data.data);
            }, function(r) {
                reject(r);
            });
        }, function(r) {
            reject(r);
        });
    });
}