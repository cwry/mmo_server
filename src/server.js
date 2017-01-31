"use strict";
const IP = process.env.IP || "127.0.0.1";
const PORT = process.env.PORT || 8080;

const server = require('http').createServer();
const io = require('socket.io')(server);
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const socketSetup = require.main.require("./socket/socket_setup.js");
const log = require.main.require("./util/log.js")("server");

log("booting...");

const db = mongoose.connect("mongodb://root:root@ds117109.mlab.com:17109/mmodb").connection;

db.on("error", (err) => {
    log.error("database connection error - shutting down", err.toString());
    process.exit(1);
});

db.once("open", () => {
    log("connected to db");

    io.on("connection", socketSetup);

    server.listen(PORT, IP);
    log("server listening on port " + PORT);
});

process.on("SIGTERM", () => {
    for (let key of Object.keys(io.sockets.connected)) {
        io.sockets.connected[key].disconnect(true);
    }
});
