"use strict";
const User = require("../../models/user_model");
const log = require("../../tools/log.js")("auth");
const worldPermission = require("../../permissions/world_permissions.js");

module.exports = function onLogin({
    socket,
    data: {
        username,
        password
    }
}) {
    return new Promise((resolve, reject) => {
        User.findOne({
            username: username
        }, (err, user) => {
            if (err) {
                log("failed to find user" + username);
                reject();
            }

            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    log.error("password compare error", username);
                    return reject();
                }
                if (!isMatch){
                    log("password didn't match", username);
                    
                    return reject();
                }
                log("user logged in: " + username);
                socket.sessionCache.user = user;
                resolve();
                socket.addPermission(worldPermission);
            });
        });
    });
};