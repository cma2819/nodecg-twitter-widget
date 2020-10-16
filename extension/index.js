"use strict";
var findOption_1 = require("./findOption");
var twitter_1 = require("./twitter");
module.exports = function (nodecg) {
    var option = findOption_1.findOption(nodecg);
    twitter_1.twitter(nodecg, option);
};
