"use strict";

const log = require("../tools/log.js")("socket");
const authPermission = require("../permissions/auth_permissions.js");

module.exports = function onConnection(socket) {
    log("new client connected:", socket.id);
    
    socket.on("action", ({
        action,
        data
    }, callback) => {
        let valid = false;
        if (action !== undefined) {
            const namespace = socket.permissions[action.namespace];
            if (namespace !== undefined) {
                const call = namespace[action.call];
                if (call !== undefined) {
                    valid = true;
                    call({
                        socket: socket,
                        data: data
                    }).then((data) => {
                        if (typeof data === "object") {
                            callback({
                                success : true,
                                data: data
                            });
                        }else{
                            callback({
                                success : true
                            });
                        }
                    }).catch((error) => {
                        if (typeof error === "object") {
                            const res = {
                                success : false
                            };

                            if (typeof error.error === "string") {
                                res.error = error.error;
                            }

                            if (typeof error.data === "object") {
                                res.data = res.data;
                            }
                            callback(res);
                        }
                        else if (typeof error === "string") {
                            callback({
                                success : false,
                                error: error
                            });
                        }
                        else {
                            callback({
                                success : false
                            });
                        }
                    });
                }
            }
        }

        if (!valid) {
            callback({
                success : false,
                error: "ERR_NO_SUCH_ACTION"
            });
        }
    });
    
    socket.addPermission = (permission) => {
        socket.permissions[permission.namespace] = permission.actions;
    };
    
    socket.removePermission = (permission) => {
        this.permissions[permission.namespace] = undefined;
    };
    
    socket.sessionCache = socket.sessionCache || {};
    socket.permissions = socket.permissions || {};
    
    socket.addPermission(authPermission);
    
    socket.emit("init");
};
