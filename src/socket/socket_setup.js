"use strict";
const log = require.main.require("./util/log.js")("socket");
const authPermission = require.main.require("./permissions/auth_permissions.js");

module.exports = function onConnection(socket) {
    log("new client connected:", socket.id);

    socket.on("action", ({
        action,
        data
    }, callback) => {
        if (action && action.namespace && socket.permissions[action.namespace] && action.call && socket.permissions[action.namespace][action.call]) {
            socket.permissions[action.namespace][action.call]({
                socket: socket,
                sessionCache: socket.sessionCache,
                data: data
            }).then((data) => {
                if (typeof data === "object") {
                    callback({
                        success: true,
                        data: data
                    });
                }
                else {
                    callback({
                        success: true
                    });
                }
            }).catch((error) => {
                if (typeof error === "object") {
                    const res = {
                        success: false
                    };

                    if (typeof error.error === "string") {
                        res.error = error.error;
                    }

                    if (typeof error.data === "object") {
                        res.data = error.data;
                    }
                    callback(res);
                }
                else if (typeof error === "string") {
                    callback({
                        success: false,
                        error: error
                    });
                }
                else {
                    callback({
                        success: false
                    });
                }
            });
        }
        else {
            callback({
                success: false,
                error: "ERR_NO_SUCH_ACTION"
            });
        }
    });

    socket.addPermission = (permission) => {
        socket.permissions[permission.namespace] = permission.actions;
    };

    socket.removePermission = (permission) => {
        socket.permissions[permission.namespace] = undefined;
    };

    socket.resetPermissions = () => {
        socket.permissions = {};
    };

    socket.deauth = () => {
        socket.reset();
        socket.emit("deauth");
        socket.disconnect(true);
    };

    socket.reset = () => {
        socket.sessionCache = {};
        socket.resetPermissions();
        socket.addPermission(authPermission);
        socket.leaveAll();
        socket.join(socket.id);
    };

    socket.sessionCache = socket.sessionCache || {};
    socket.permissions = socket.permissions || {};

    socket.addPermission(authPermission);

    socket.on("disconnect", () => {
        log("client disconnected", socket.id);
    });

    socket.emit("init");
};
