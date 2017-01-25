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
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    characters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "character"
    }]
});

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) return next();

    const user = this;
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            console.log(hash);
            user.password = hash;
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
