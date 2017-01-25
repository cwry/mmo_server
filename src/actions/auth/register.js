"use strict";
const User = require("../../models/user_model");
const log = require("../../tools/log.js")("auth");

module.exports = function({
    data: {
        username,
        password
    }
}) {
    return new Promise((resolve, reject) => {
        const user = new User({
            username: username,
            password: password
        });

        user.save()
            .then(() => {
                log("registered user", username);
                resolve();
            })
            .catch((err) => {
                log.error("register error - user", username, err.toString());
                reject();
            });
    });
};
