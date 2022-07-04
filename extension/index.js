"use strict";
const findOption_1 = require("./findOption");
const twitter_1 = require("./twitter");
module.exports = (nodecg) => {
    const option = findOption_1.findOption(nodecg);
    twitter_1.twitter(nodecg, option);
};
