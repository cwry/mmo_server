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

        user.save((err) => {
            if (err) {
                log.error("failed to register user", username, err.toString());
                return reject();
            }

            log("registered user", username);
            resolve();
        });
    });
};
