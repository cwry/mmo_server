"use strict";
const log = require("../../tools/log.js")("lobby");

module.exports = function({
    socket
}) {
    return new Promise((resolve, reject) => {
        socket.sessionCache.user.populate("characters").execPopulate()
            .then((user) => {
                const chars = [];
                for (let c of user.characters) {
                    const {
                        name,
                        id
                    } = c;

                    chars.push({
                        id: id,
                        name: name
                    });
                }

                log("successfully sent character info to user", user.username);
                resolve({
                    characters: chars
                });
            })
            .catch((err) => {
                log.error("couldn't populate characters of user", socket.sessionCache.user.username, err.toString());
                reject();
            });
    });
};
