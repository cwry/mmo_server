"use strict";
module.exports = {
    namespace: "auth",
    actions: {
        register: require("../actions/auth/register.js"),
        login: require("../actions/auth/login.js")
    }
};