"use strict";
const Zone = require.main.require("./game_logic/zone.js");

module.exports = {
    default : Zone(require.main.require("./game_data/maps/default.json"))
};