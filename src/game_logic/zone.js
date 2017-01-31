"use strict";
const log = require.main.require("./util/log.js")("zone");

module.exports = function Zone({
    zone
}) {
    const players = {};
    
    const join = (socket, {x, y}) => {
        players[socket.id] = {
            socket : socket,
            sessionCache : socket.sessionCache
        };
        socket.on("disconnect", onSocketDisconnect);
        socket.sessionCache.character.position.zone = zone;
        socket.sessionCache.character.position.x = x;
        socket.sessionCache.character.position.y = y;
        socket.to(zone).emit("zone:character_joined", socket.sessionCache.character.extractPublicInfo());
        log("user", socket.sessionCache.user.username, "joined zone", zone);
    };
    
    const subscribe = (socket) => {
        socket.join(zone);
    };
    
    const leave = (socket) => {
        socket.leave(zone);
        socket.removeListener("disconnect", onSocketDisconnect);
        socket.to(zone).emit("zone:character_left", players[socket.id].sessionCache.character.extractPublicInfo());
        log("user", players[socket.id].sessionCache.user.username, "left zone", zone);
        players[socket.id] = undefined;
    };

    const onSocketDisconnect = function() {
        leave(this);
    };
    
    const extractEntityList = () => {
        const entityList = {};
        entityList.players = [];
        for(let socketID of Object.keys(players)){
            entityList.players.push(players[socketID].sessionCache.character.extractPublicInfo());
        }
        return entityList;
    };

    return {
        join: join,
        leave: leave,
        subscribe : subscribe,
        extractEntityList : extractEntityList
    };
};
