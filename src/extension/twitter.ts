import { NodeCG } from './nodecg';
import { Tweet } from '../nodecg/generated/tweet';
import { FindOption } from './findOption';
import { Twitter } from './lib/Twitter';

export const twitter = (nodecg: NodeCG, findOption: FindOption): void => {
  const activeSeconds = nodecg.bundleConfig.activeSeconds || 60;
  const maxTweets = nodecg.bundleConfig.listMaximum || 50;
  const logger = new nodecg.Logger(`${nodecg.bundleName}:twitter`);
  const config = nodecg.bundleConfig.twitter;
  if (!config || !config.targetWords || !config.consumerKey || !config.consumerSecret) {
    logger.warn('Twitter config is not defined.');
    return;
  }

  const twitterApi = new Twitter({
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret
  }, (err) => {
    logger.error(err);
  });

  const activeTweetRep = nodecg.Replicant('activeTweet', {
    defaultValue: null
  });
  const tweetDataArrayRep = nodecg.Replicant('tweetDataArray', {
    defaultValue: []
  });

  const addTweet = (tweet: Tweet): void => {
    if (!tweetDataArrayRep.value || tweetDataArrayRep.value.find(t => t.id === tweet.id)) {
      return;
    }
    tweetDataArrayRep.value = [tweet].concat(tweetDataArrayRep.value).slice(0, maxTweets);
  }

  const activateTweet = (id: number): void => {
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
    activeTweetRep.value = { ...tweet };
    tweetDataArrayRep.value.splice(tweetIndex, 1);
    setTimeout(() => {
      activeTweetRep.value = null;
    }, activeSeconds * 1000)
  }

  logger.info(`Tracking with "${config.targetWords.join(',')}"`);

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

  twitterApi.startStream(
    config.targetWords,
    {
      retweet: !findOption.removeRetweet
    },
    () => {
      addTweet({
        id: 123456789,
        name: 'name',
        profileImageUrl: 'https://image.example.com',
        screenName: 'screenName',
        text: 'tweeeeet.'
      });
    }
  );
  nodecg.listenFor('twitter:activate', activateTweet);
}
