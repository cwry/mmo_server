"use strict";
const Zone = require("../game_logic/zone.js");

module.exports = {
    default : Zone(require("./maps/default.json"))
};