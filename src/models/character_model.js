"use strict";
const mongoose = require("mongoose");

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
        minlength: 3,
        maxlength: 12,
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

characterSchema.methods.extractPublicInfo = function() {
    const {
        id,
        name,
        position: {
            zone,
            x,
            y
        }
    } = this;

    return {
        id: id,
        name: name,
        position: {
            zone: zone,
            x: x,
            y: y
        }
    };
};

module.exports = mongoose.model("character", characterSchema);
