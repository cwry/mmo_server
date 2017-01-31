"use strict";
const log = require.main.require("./util/log.js")("lobby", "get character data");

module.exports = function({
    sessionCache
}) {
    return new Promise((resolve, reject) => {
        sessionCache.user.populate("characters").execPopulate()
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
                log.error("couldn't populate characters of user", sessionCache.user.username, err.toString());
                reject();
            });
    });
};
