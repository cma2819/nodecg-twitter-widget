"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twitter = void 0;
const tslib_1 = require("tslib");
const twitter_api_sdk_1 = tslib_1.__importDefault(require("twitter-api-sdk"));
class Twitter {
    constructor(credentials, errorHandler) {
        this.credentials = credentials;
        this.errorHandler = errorHandler;
        this.twitter = new twitter_api_sdk_1.default(credentials.bearer);
    }
    async resetRules(trackWords, option) {
        var _a, _b;
        const rules = await this.twitter.tweets.getRules();
        const ruleIds = (_b = (_a = rules.data) === null || _a === void 0 ? void 0 : _a.map((rule) => rule.id)) === null || _b === void 0 ? void 0 : _b.filter((id) => {
            return !!id;
        });
        if (ruleIds) {
            await this.twitter.tweets.addOrDeleteRules({
                delete: {
                    ids: ruleIds,
                },
            });
        }
        const addValues = [`(${trackWords.join(' OR ')})`];
        if (!option.retweet) {
            addValues.push('-is:retweet');
        }
        await this.twitter.tweets.addOrDeleteRules({
            add: [
                {
                    value: addValues.join(' '),
                },
            ],
        });
    }
    async startStream(trackWords, option, onTweet) {
        var e_1, _a;
        var _b, _c;
        this.resetRules(trackWords, option);
        const searchedStream = this.twitter.tweets.searchStream({
            'expansions': ['author_id'],
            'user.fields': ['profile_image_url', 'name', 'username'],
        });
        try {
            for (var searchedStream_1 = tslib_1.__asyncValues(searchedStream), searchedStream_1_1; searchedStream_1_1 = await searchedStream_1.next(), !searchedStream_1_1.done;) {
                const tweet = searchedStream_1_1.value;
                if (!tweet.data || !tweet.includes || !((_c = (_b = tweet.includes) === null || _b === void 0 ? void 0 : _b.users) === null || _c === void 0 ? void 0 : _c[0].profile_image_url)) {
                    this.errorHandler(new Error(`Skip add tweet: ${JSON.stringify(tweet)}`));
                    continue;
                }
                onTweet({
                    id: tweet.data.id,
                    profileImageUrl: tweet.includes.users[0].profile_image_url,
                    name: tweet.includes.users[0].name,
                    screenName: tweet.includes.users[0].username,
                    text: tweet.data.text,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (searchedStream_1_1 && !searchedStream_1_1.done && (_a = searchedStream_1.return)) await _a.call(searchedStream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
}
exports.Twitter = Twitter;
