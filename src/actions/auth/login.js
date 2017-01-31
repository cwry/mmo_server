"use strict";
const User = require.main.require("./models/user_model.js");
const authPermission = require.main.require("./permissions/auth_permissions.js");
const lobbyPermission = require.main.require("./permissions/lobby_permissions.js");

const log = require.main.require("./util/log.js")("auth", "login");
const ClientError = require.main.require("./util/client_error_codes.js")(
    "ERR_USER_NOT_FOUND",
    "ERR_WRONG_PASSWORD"
);

const logins = {};

module.exports = function({
    socket,
    sessionCache,
    data : {
        username,
        password
    } = {}
}) {
    return new Promise((resolve, reject) => {
        User.findOne({
                username: username
            })
            .then((user) => {
                if (!user) {
                    reject(ClientError("ERR_USER_NOT_FOUND"));
                    return Promise.reject("failed to find user " + username);
                }

                return Promise.all([user, user.comparePassword(password)])
                    .catch(() => {
                        reject(ClientError("ERR_WRONG_PASSWORD"));
                        return Promise.reject("wrong password for user " + username);
                    });
            })
            .then(([user]) => {
                if (logins[user.id]) {
                    const otherSocket = logins[user.id];
                    otherSocket.deauth();
                    log("socket", otherSocket.id, "already logged in as user", username, "- deauthenticated");
                }

                logins[user.id] = socket;
                sessionCache.user = user;
                socket.addPermission(lobbyPermission);
                socket.removePermission(authPermission);

                socket.on("disconnect", () => {
                    logins[user.id] = undefined;
                    socket.reset();
                    log("user logged off:", user.username);

                    user.save()
                        .then(() => {
                            log("successfully saved user", user.username);
                        })
                        .catch((err) => {
                            log.error("error saving user", user.username, err.toString());
                        });
                });

                log("user logged in: " + username);
                resolve();
            })
            .catch((err) => {
                log.error(err.toString());
                reject();
            });
    });
};
