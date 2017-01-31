"use strict";
const User = require.main.require("./models/user_model");

const log = require.main.require("./util/log.js")("auth", "register");
const ClientError = require.main.require("./util/client_error_codes.js")(
    "ERR_INVALID_USERNAME"
);

module.exports = function({
    data: {
        username,
        password
    } = {}
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
                log.error(err.toString());
                reject(ClientError("ERR_INVALID_USERNAME"));
            });
    });
};
