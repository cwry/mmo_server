"use strict";
const log = require("../tools/log.js")("zone");

module.exports = function Zone({
    zone
}) {
    const sockets = {};

    const join = (socket) => {
        const zoneCharData = extractZoneCharData();
        sockets[socket.id] = socket;
        socket.join(zone);
        socket.to(zone).emit("zone/character_joined", extractCharData(socket));
        socket.on("disconnect", onSocketDisconnect);

        log("user", socket.sessionCache.user.username, "joined zone", zone);
        return zoneCharData;
    };

    const leave = (socket) => {
        sockets[socket.id] = undefined;
        socket.leave(zone);
        socket.to(zone).emit("zone/character_left", extractCharData(socket));
        socket.removeListener("disconnect", onSocketDisconnect);

        log("user", socket.sessionCache.user.username, "left zone", zone);
    };

    const onSocketDisconnect = function() {
        leave(this);
    };

    const extractZoneCharData = () => {
        const charData = {};

        for (let key of Object.keys(sockets)) {
            const {
                id,
                name,
                position: {
                    x,
                    y
                }
            } = sockets[key].sessionCache.character;

            charData[id] = {
                name: name,
                position: {
                    x: x,
                    y: y
                }
            };
        }

        return charData;
    };

    const extractCharData = (socket) => {
        const {
            id,
            name,
            position: {
                x,
                y
            }
        } = socket.sessionCache.character;

        return {
            id: id,
            name: name,
            position: {
                zone: zone,
                x: x,
                y: y
            }
        };
    };

    return {
        join: join,
        leave: leave
    }
}
