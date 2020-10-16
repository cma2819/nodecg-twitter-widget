"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var twitter_1 = tslib_1.__importDefault(require("twitter"));
exports.twitter = function (nodecg, findOption) {
    var activeSeconds = nodecg.bundleConfig.activeSeconds || 60;
    var maxTweets = nodecg.bundleConfig.listMaximum || 50;
    var logger = new nodecg.Logger(nodecg.bundleName + ":twitter");
    var config = nodecg.bundleConfig.twitter;
    if (!config || !config.targetWords || !config.consumerKey || !config.consumerSecret || !config.accessTokenKey || !config.accessTokenSecret) {
        logger.warn('Twitter config is not defined.');
        return;
    }
    var activeTweetRep = nodecg.Replicant('activeTweet', {
        defaultValue: null
    });
    var tweetDataArrayRep = nodecg.Replicant('tweetDataArray', {
        defaultValue: []
    });
    var addTweet = function (tweet) {
        if (!tweetDataArrayRep.value || tweetDataArrayRep.value.find(function (t) { return t.id === tweet.id; })) {
            return;
        }
        tweetDataArrayRep.value = [tweet].concat(tweetDataArrayRep.value).slice(0, maxTweets);
    };
    var activateTweet = function (id) {
        if (!tweetDataArrayRep.value || activeTweetRep.value === undefined) {
            return;
        }
        if (activeTweetRep.value !== null) {
            logger.warn('Tweet is already activated.');
        }
        var tweetIndex = tweetDataArrayRep.value.findIndex(function (t) { return t.id === id; });
        var tweet = tweetDataArrayRep.value[tweetIndex];
        if (!tweet) {
            logger.warn('Target tweet is not found.');
            return;
        }
        activeTweetRep.value = tslib_1.__assign({}, tweet);
        tweetDataArrayRep.value.splice(tweetIndex, 1);
        setTimeout(function () {
            activeTweetRep.value = null;
        }, activeSeconds * 1000);
    };
    var client = new twitter_1.default({
        'consumer_key': config.consumerKey,
        'consumer_secret': config.consumerSecret,
        'access_token_key': config.accessTokenKey,
        'access_token_secret': config.accessTokenSecret
    });
    var filterTrack = config.targetWords.join(',');
    logger.info("Tracking with \"" + filterTrack + "\"");
    var startStream = function () {
        logger.info('Try to connect stream.');
        client.stream('statuses/filter', { track: filterTrack }, function (stream) {
            stream.on('data', function (tweet) {
                if (findOption.removeRetweet && tweet.retweeted_status) {
                    return;
                }
                addTweet({
                    id: tweet.id,
                    name: tweet.user.name,
                    screenName: tweet.user.screen_name,
                    profileImageUrl: tweet.user.profile_image_url_https || tweet.user.profile_image_url || null,
                    text: tweet.text
                });
            });
            stream.on('error', function (error) {
                logger.info('Error happened on stream.');
                logger.error(error);
                setTimeout(startStream, 5 * 60 * 1000);
            });
        });
    };
    if (activeTweetRep.value) {
        activeTweetRep.value = null;
    }
    startStream();
    nodecg.listenFor('twitter:activate', activateTweet);
};
