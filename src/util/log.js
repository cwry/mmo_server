"use strict";
module.exports = function getLogFunction(...prefixes) {
    for(let i = 0; i < prefixes.length; i++){
        prefixes[i] = "[" + prefixes[i].toUpperCase() + "]";
    }
    const log = console.log.bind(console, ...prefixes);
    log.error = log.bind(console, "[ERROR]");
    return log;
};
