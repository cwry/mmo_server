"use strict"
module.exports = function getLogFunction(prefix){
    const log = console.log.bind(console, "[" + prefix.toUpperCase() + "]");
    log.error = log.bind(console, "[ERROR]");
    return log;
}