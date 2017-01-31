"use strict";
const log = require.main.require("./util/log.js")("client error code");

module.exports = function(...args){
    const errors = {};
    for(let error of args){
        errors[error.toUpperCase()] = true;
    }
    
    return (error, data) => {
        if(typeof error != "string") return;
        error = error.toUpperCase();
        
        if(!errors[error]){
            log("error code", error, "isn't defined");
            return;
        }
        
        if(typeof data != "undefined" && typeof data != "object"){
            log("error data has to be an object - error code", error);
            return error;
        }
        
        return {
            error : error,
            data : data
        };
    };
};