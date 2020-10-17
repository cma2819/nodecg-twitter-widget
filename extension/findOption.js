"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOption = void 0;
exports.findOption = function (nodecg) {
    var defaultOption = {
        removeRetweet: false
    };
    return Object.assign(defaultOption, nodecg.bundleConfig.findOption);
};
