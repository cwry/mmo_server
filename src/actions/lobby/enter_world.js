"use strict";
const Character = require.main.require("./models/character_model.js");
const lobbyPermission = require.main.require("./permissions/lobby_permissions.js");
const worldPermission = require.main.require("./permissions/world_permissions.js");
const zones = require.main.require("./game_data/zones.js");
const spawnPoints = require.main.require("./game_data/spawn_points.js");

const log = require.main.require("./util/log.js")("lobby", "enter world");
const ClientError = require.main.require("./util/client_error_codes.js")(
    "ERR_CHARACTER_NOT_FOUND"
);

module.exports = function({
    socket,
    sessionCache,
    data: {
        character_id
    } = {}
}) {
    return new Promise((resolve, reject) => {
        Character.findById(character_id)
            .catch((err) => {
                reject(ClientError("ERR_CHARACTER_NOT_FOUND"));
                return Promise.reject(err);
            })
            .then((character) => {
                if (!character) {
                    reject(ClientError("ERR_CHARACTER_NOT_FOUND"));
                    return Promise.reject("failed to find character " + character_id);
                }
                if (character.user != sessionCache.user.id) {
                    reject(ClientError("ERR_CHARACTER_NOT_FOUND"));
                    return Promise.reject("user " + sessionCache.user.username + " tried to login with foreign character");
                }
                
                if (!zones[character.position.zone]) {
                    character.position.zone = spawnPoints.default.zone;
                    character.position.x = spawnPoints.default.position.x;
                    character.position.y = spawnPoints.default.position.y;
                }

                sessionCache.character = character;
                socket.removePermission(lobbyPermission);
                socket.addPermission(worldPermission);
                socket.on("disconnect", () => {
                    character.save()
                        .then(() => {
                            log("successfully saved character", character.name);
                        })
                        .catch((err) => {
                            log.error("error saving character", character.name, err.toString());
                        });
                });
                
                zones[character.position.zone].join(socket, {x : character.position.x, y : character.position.y});
                resolve({
                    zone : character.position.zone
                });
                log("character", character.name, "entered world");
            })
            .catch((err) => {
                log.error(err.toString());
                reject();
            });
    });
};
