"use strict";
const Character = require("../../models/character_model.js");
const log = require("../../tools/log.js")("lobby");
const spawnPoints = require("../../game_data/spawn_points.js");

module.exports = function({
    socket,
    data: {
        name
    }
}) {
    return new Promise((resolve, reject) => {
        const user = socket.sessionCache.user;
        const character = new Character({
            user: user.id,
            name: name,
            position: {
                zone: spawnPoints.default.zone,
                x: spawnPoints.default.position.x,
                y: spawnPoints.default.position.y
            }
        });

        character.save()
            .then(() => {
                log("created character", name);
                user.characters.push(character.id);
                user.save()
                    .then(() => {
                        log("assigned character", character.id, "to user", user.username);
                        resolve();
                    })
                    .catch((err) => {
                        log.error("failed to assign character", character.id, "to user", user.username, "error:" + err.toString());
                        reject();
                    });
            })
            .catch((err) => {
                log("failed to create character", name, err.toString());
                reject();
            });
    });
};
