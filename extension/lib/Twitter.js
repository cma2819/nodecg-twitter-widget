"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twitter = void 0;
var tslib_1 = require("tslib");
var needle_1 = tslib_1.__importDefault(require("needle"));
var TWITTER_API_V2 = 'https://api.twitter.com/2';
var Twitter = /** @class */ (function () {
    function Twitter(credentials, errorHandler) {
        var _this = this;
        this.credentials = credentials;
        this.errorHandler = errorHandler;
        needle_1.default.post('https://api.twitter.com/oauth2/token?grant_type=client_credentials', {}, {
            headers: {
                'Authorization': "Basic " + credentials.consumerKey + ":" + credentials.consumerSecret,
            },
        }, function (err, response) {
            if (err) {
                _this.errorHandler(new Error("OAuth2 credentials error.\n" + err));
                return;
            }
            console.log("Basic " + credentials.consumerKey + ":" + credentials.consumerSecret);
            _this.bearer = response.body;
        });
    }
    Twitter.prototype.resetRules = function () {
        var _this = this;
        console.log(this.bearer);
        // fetch rules
        needle_1.default.get(TWITTER_API_V2 + "/tweets/search/stream/rules", {
            headers: {
                'Authorization': "Bearer " + this.bearer,
            },
        }, function (err, response) {
            if (err) {
                _this.errorHandler(err);
            }
            var rules = response.body.data;
            var ruleIds = rules.map(function (rule) { return rule.id; });
            // delete rules
            needle_1.default.post(TWITTER_API_V2 + "/tweets/search/stream/rules", {
                delete: { ids: ruleIds }
            }, {
                headers: {
                    'Authorization': "Bearer " + _this.bearer,
                },
            }, function (err) {
                if (err) {
                    _this.errorHandler(err);
                }
            });
        });
    };
    Twitter.prototype.startStream = function (trackWords, option, onTweet) {
        return;
        this.resetRules();
        onTweet();
        console.log(TWITTER_API_V2);
        console.log(trackWords);
        console.log(option);
    };
    return Twitter;
}());
exports.Twitter = Twitter;
