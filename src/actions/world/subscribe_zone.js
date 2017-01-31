"use strict";
const zones = require.main.require("./game_data/zones.js");

const log = require.main.require("./util/log.js")("world", "subscribe zone");

module.exports = function({
    socket,
    sessionCache
}) {
    return new Promise((resolve, reject) => {
        if (!zones[sessionCache.character.position.zone]) {
            reject();
        }
        
        const zone = zones[sessionCache.character.position.zone];
        zone.subscribe(socket);
        
        log("socket", socket.id, "subscribed to zone", sessionCache.character.position.zone);
        resolve(zone.extractEntityList());
    });
};
