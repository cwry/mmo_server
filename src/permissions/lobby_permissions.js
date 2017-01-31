"use strict";
module.exports = {
    namespace: "lobby",
    actions: {
        create_character: require.main.require("./actions/lobby/create_character.js"),
        get_character_data: require.main.require("./actions/lobby/get_character_data.js"),
        enter_world: require.main.require("./actions/lobby/enter_world.js")
    }
};
