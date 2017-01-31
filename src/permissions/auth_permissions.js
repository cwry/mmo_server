"use strict";
module.exports = {
    namespace: "auth",
    actions: {
        register: require.main.require("./actions/auth/register.js"),
        login: require.main.require("./actions/auth/login.js")
    }
};
