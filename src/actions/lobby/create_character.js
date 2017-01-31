"use strict";
const Character = require.main.require("./models/character_model.js");
const spawnPoints = require.main.require("./game_data/spawn_points.js");

const log = require.main.require("./util/log.js")("lobby", "create character");
const ClientError = require.main.require("./util/client_error_codes.js")(
    "ERR_CHARACTER_LIMIT_REACHED",
    "ERR_INVALID_CHARACTER_NAME"
);

module.exports = function({
    sessionCache,
    data: {
        name
    } = {}
}) {
    return new Promise((resolve, reject) => {
        const user = sessionCache.user;
        const character = new Character({
            user: user.id,
            name: name,
            position: {
                zone: spawnPoints.default.zone,
                x: spawnPoints.default.position.x,
                y: spawnPoints.default.position.y
            }
        });

        user.characters.push(character.id);
        user.save()
            .catch((err) => {
                reject(ClientError("ERR_CHARACTER_LIMIT_REACHED"));
                return Promise.reject("failed to assign character " + character.name + " to user " + user.username + ": " + err.toString());
            })
            .then(() => {
                return character.save()
                    .catch((err) => {
                        reject(ClientError("ERR_INVALID_CHARACTER_NAME"));
                        return Promise.reject("failed to create character " + name + ": " + err.toString());
                    });
            })
            .then(() => {
                log("created character", name);
                resolve();
            })
            .catch((err) => {
                log.error(err.toString());
                user.characters.pop();
                reject();
            });
    });
};
