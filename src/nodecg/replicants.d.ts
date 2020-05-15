import { Assets } from "./asset";
import { ActiveTweet } from './generated/activeTweet';
import { TweetDataArray } from './generated/tweetDataArray';

type ReplicantMap = {
    assets: Assets,
    activeTweet: ActiveTweet,
    tweetDataArray: TweetDataArray
};

type ReplicantName = (
    'activeTweet' |
    'tweetDataArray'
);

export {
    Assets,
    ReplicantMap,
    ReplicantName
};
