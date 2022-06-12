"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitter = void 0;
var tslib_1 = require("tslib");
var Twitter_1 = require("./lib/Twitter");
exports.twitter = function (nodecg, findOption) {
    var activeSeconds = nodecg.bundleConfig.activeSeconds || 60;
    var maxTweets = nodecg.bundleConfig.listMaximum || 50;
    var logger = new nodecg.Logger(nodecg.bundleName + ":twitter");
    var config = nodecg.bundleConfig.twitter;
    if (!config || !config.targetWords || !config.consumerKey || !config.consumerSecret) {
        logger.warn('Twitter config is not defined.');
        return;
    }
    var twitterApi = new Twitter_1.Twitter({
        consumerKey: config.consumerKey,
        consumerSecret: config.consumerSecret
    }, function (err) {
        logger.error(err);
    });
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
    logger.info("Tracking with \"" + config.targetWords.join(',') + "\"");
    // const startStream = (): void => {
    //   logger.info('Try to connect stream.');
    //   client.stream('statuses/filter', { track: filterTrack }, (stream) => {
    //     stream.on('data', (tweet) => {
    //       logger.info(`tracked tweet[${tweet.id}]: ${tweet.text}`);
    //       if (findOption.removeRetweet && tweet.retweeted_status) {
    //         logger.info(`tweet[${tweet.id}] filtered.`)
    //         return;
    //       }
    //       logger.info(`tweet[${tweet.id}] added.`)
    //       addTweet({
    //         id: tweet.id,
    //         name: tweet.user.name,
    //         screenName: tweet.user.screen_name,
    //         profileImageUrl: tweet.user.profile_image_url_https || tweet.user.profile_image_url || null,
    //         text: tweet.text
    //       });
    //     });
    //     stream.on('error', (error) => {
    //       logger.info('Error happened on stream.');
    //       logger.error(error);
    //       setTimeout(startStream, 5 * 60 * 1000);
    //     })
    //   });
    // }
    if (activeTweetRep.value) {
        activeTweetRep.value = null;
    }
    twitterApi.startStream(config.targetWords, {
        retweet: !findOption.removeRetweet
    }, function () {
        addTweet({
            id: 123456789,
            name: 'name',
            profileImageUrl: 'https://image.example.com',
            screenName: 'screenName',
            text: 'tweeeeet.'
        });
    });
    nodecg.listenFor('twitter:activate', activateTweet);
};
