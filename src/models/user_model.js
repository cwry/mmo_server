"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 12,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    characters: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "character",
        }],
        validate: {
            validator: (val) => {
                return val.length <= 3;
            },
            message: "{PATH} exceeds the limit of 3"
        }
    }
});

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, cb) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) return reject(err);
            if (!isMatch) return reject(new Error("password doesn't match"));
            resolve();
        });
    });
};

module.exports = mongoose.model("user", userSchema);
