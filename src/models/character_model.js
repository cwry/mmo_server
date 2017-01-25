"use strict";
const mongoose = require("mongoose");
const User = require("./user_model.js");

const characterSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },

    name: {
        type: String,
        required: true,
        lowercase: true,
        index: {
            unique: true
        }
    },

    position: {
        zone: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            required: true,
            get: n => Math.floor(n),
            set: n => Math.floor(n)
        },
        y: {
            type: Number,
            required: true,
            get: n => Math.floor(n),
            set: n => Math.floor(n)
        }
    }
});

module.exports = mongoose.model("character", characterSchema);
