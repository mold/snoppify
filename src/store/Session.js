import Vue from "vue";
import api from "../api";

export default {
    namespaced: true,

    state: {
        user: {},
        username: "",
    },

    getters: {
        user: state => state.user,
        username: state => state.username,
    },

    mutations: {
        SET_SESSION: (state, sessionData) => {
            Object.assign(state.user, sessionData);
            state.username = sessionData.username;
        },

        SOCKET_EVENT(state, data) {
            switch (data.type) {
                case "friend.vote":
                    var uVoter = data.data.voter;
                    var uIssuer = data.data.user;
                    // issuer
                    if (uIssuer.username == state.username) {
                        state.user.votes.received[uVoter.username] = data.data.votes;
                        state.user.votes.receivedTotal = uIssuer.votes.receivedTotal;

                        if (data.data.vote == 1) {
                            this.dispatch("Messages/toast", {
                                type: "moss",
                                html: "<b>" + uVoter.displayName + "<b> upvoted your track!",
                                duration: 10,
                            });
                        }
                    }
                    // voter
                    if (uVoter.username == state.username) {
                        state.user.votes.given[uIssuer.username] = data.data.votes;
                        state.user.votes.givenTotal = uVoter.votes.givenTotal;
                    }
                    break;
                case "friend.new":
                    var uVoter = data.data.voter;
                    var uIssuer = data.data.user;
                    // issuer
                    if (uIssuer.username == state.username) {
                        state.user.friends = uIssuer.friends;

                        this.dispatch("Messages/popup", {
                            type: "deepsea",
                            html:
                                "<p>New friend!</p>" +
                                "<p><b>" + uVoter.displayName + "</b> liked more than 3 of your tracks.</p>" +
                                "<p>You should be friends!</p>",
                            //duration: 10,
                        });
                    }
                    // voter
                    if (uVoter.username == state.username) {
                        state.user.friends = uVoter.friends;

                        this.dispatch("Messages/popup", {
                            type: "deepsea",
                            html:
                                "<p>New friend!</p>" +
                                "<p>You liked more than 3 tracks queued by <b>" + uIssuer.displayName + "</b>.</p>" +
                                "<p>You should be friends!</p>",
                            //duration: 10,
                        });
                    }
                    break;
            }
        },
    },

    actions: {
        CREATE_SESSION({ commit }, username) {
            return api.auth.newUser(username).then(
                resp => {
                    commit("SET_SESSION", {
                        username,
                    });
                },
                err => {
                    console.log(err);
                },
            );
        },
        AUTH(context) {
            return api.auth.auth().then(
                sessionData => {
                    context.commit("SET_SESSION", sessionData);
                },
                err => {
                    console.log(err);
                },
            );
        },
    },
};
