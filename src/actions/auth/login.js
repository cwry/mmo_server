"use strict";
const User = require("../../models/user_model.js");
const log = require("../../tools/log.js")("auth");
const authPermission = require("../../permissions/auth_permissions.js");
const lobbyPermission = require("../../permissions/lobby_permissions.js");
const logins = {};

module.exports = function onLogin({
    socket,
    data: {
        username,
        password
    }
}) {
    return new Promise((resolve, reject) => {
        User.findOne({
                username: username
            })
            .then((user) => {
                if (!user) {
                    log("failed to find user", username);
                    return reject();
                }

                user.comparePassword(password)
                    .then(() => {
                        if (logins[user.id]) {
                            const otherSocket = logins[user.id];
                            log("socket", socket.id, "already logged in as user", user.username);
                            otherSocket.disconnect(true);
                            otherSocket.resetToInit();
                        }

                        logins[user.id] = socket;
                        socket.on("disconnect", () => {
                            user.save()
                                .then(() => {
                                    log("successfully saved user", user.username);
                                })
                                .catch((err) => {
                                    log.error("error saving user", user.username, err.toString());
                                });

                            logins[user.id] = undefined;
                            socket.resetToInit();
                            log("user logged off:", user.username);
                        });

                        socket.sessionCache.user = user;
                        socket.addPermission(lobbyPermission);
                        socket.removePermission(authPermission);

                        log("user logged in: " + username);
                        resolve();
                    })
                    .catch((err) => {
                        log.error("password compare error", username, err.toString());
                        reject();
                    });
            })
            .catch((err) => {
                log.error("login error", err.toString());
                reject();
            });
    });
};
