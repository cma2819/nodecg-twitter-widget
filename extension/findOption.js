"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOption = function (nodecg) {
    var defaultOption = {
        removeRetweet: false
    };
    return Object.assign(defaultOption, nodecg.bundleConfig.findOption);
};
