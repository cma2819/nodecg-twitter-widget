"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitter = void 0;
const Twitter_1 = require("./lib/Twitter");
exports.twitter = (nodecg, findOption) => {
    const activeSeconds = nodecg.bundleConfig.activeSeconds || 60;
    const maxTweets = nodecg.bundleConfig.listMaximum || 50;
    const logger = new nodecg.Logger(`${nodecg.bundleName}:twitter`);
    const config = nodecg.bundleConfig.twitter;
    if (!config || !config.targetWords || !config.bearer) {
        logger.warn('Twitter config is not defined.');
        return;
    }
    const twitterApi = new Twitter_1.Twitter({
        bearer: config.bearer,
    }, (err) => {
        logger.error(err);
    }, logger);
    const activeTweetRep = nodecg.Replicant('activeTweet', {
        defaultValue: null
    });
    const tweetDataArrayRep = nodecg.Replicant('tweetDataArray', {
        defaultValue: []
    });
    const addTweet = (tweet) => {
        if (!tweetDataArrayRep.value || tweetDataArrayRep.value.find(t => t.id === tweet.id)) {
            return;
        }
        tweetDataArrayRep.value = [tweet].concat(tweetDataArrayRep.value).slice(0, maxTweets);
    };
    const activateTweet = (id) => {
        if (!tweetDataArrayRep.value || activeTweetRep.value === undefined) {
            return;
        }
        if (activeTweetRep.value !== null) {
            logger.warn('Tweet is already activated.');
        }
        const tweetIndex = tweetDataArrayRep.value.findIndex(t => t.id === id);
        const tweet = tweetDataArrayRep.value[tweetIndex];
        if (!tweet) {
            logger.warn('Target tweet is not found.');
            return;
        }
        activeTweetRep.value = Object.assign({}, tweet);
        tweetDataArrayRep.value.splice(tweetIndex, 1);
        setTimeout(() => {
            activeTweetRep.value = null;
        }, activeSeconds * 1000);
    };
    logger.info(`Tracking with "${config.targetWords.join(',')}"`);
    if (activeTweetRep.value) {
        activeTweetRep.value = null;
    }
    try {
        twitterApi.startStream(config.targetWords, {
            retweet: !findOption.removeRetweet
        }, (tweet) => {
            addTweet(tweet);
        });
    }
    catch (e) {
        logger.error(e);
    }
    nodecg.listenFor('twitter:activate', activateTweet);
};
