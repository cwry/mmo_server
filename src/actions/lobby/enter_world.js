"use strict";
const log = require("../../tools/log.js")("lobby");
const Character = require("../../models/character_model.js");
const lobbyPermission = require("../../permissions/lobby_permissions.js");
const worldPermission = require("../../permissions/world_permissions.js");
const zones = require("../../game_data/zones.js");

module.exports = function({
    socket,
    data: {
        character_id
    }
}) {
    return new Promise((resolve, reject) => {
        Character.findById(character_id)
            .then((character) => {
                if (!character) {
                    log("failed to find character", character_id);
                    return reject();
                }
                if (character.user != socket.sessionCache.user.id) {
                    log("user", socket.sessionCache.user.username, "tried to login with foreign character");
                    return reject();
                }
                if (!zones[character.position.zone]) {
                    log("zone", character.position.zone, "doesn't exist");
                    return reject();
                }

                socket.sessionCache.character = character;
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
                
                resolve(zones[character.position.zone].join(socket));
                log("character", character.name, "entered world");
            })
            .catch((err) => {
                log.error("enter world error - character", character_id, err.toString());
                reject();
            });
    });
};
