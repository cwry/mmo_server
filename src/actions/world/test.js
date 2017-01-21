"use strict";
module.exports = function test(){
    return new Promise((resolve, reject) => {
        resolve({"hi" : "bye"});
    });
};