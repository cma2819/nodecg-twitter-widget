import { Logger } from 'ts-nodecg/helper/logger';
import Client from 'twitter-api-sdk';
import { Tweet } from '../../nodecg/generated/tweet';

export type RuleOptions = {
  retweet?: boolean;
}

export type TwitterCredentials = {
  bearer: string;
};

export class Twitter {

  protected twitter: Client;

  constructor(credentials: TwitterCredentials, protected errorHandler: (err: Error) => void, protected logger: Logger) {

    this.twitter = new Client(credentials.bearer);
  }

  private async resetRules(trackWords: string[], option: RuleOptions): Promise<void> {
    const rules = await this.twitter.tweets.getRules();

    const ruleIds = rules.data?.map((rule) => rule.id)?.filter((id): id is string => {
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

    const addRules = {
      add: [
        {
          value: addValues.join(' '),
        },
      ],
    };
    const resultRules = await this.twitter.tweets.addOrDeleteRules(addRules);

    this.logger.debug(`created rules: ${JSON.stringify(resultRules?.meta?.summary)}`);
    this.logger.debug(`with payload: ${JSON.stringify(addRules)}`);

  }

  async startStream(trackWords: string[], option: RuleOptions, onTweet: (tweet: Tweet) => void): Promise<void> {
    await this.resetRules(trackWords, option);
    const searchedStream = this.twitter.tweets.searchStream({
      'expansions': ['author_id'],
      'user.fields': ['profile_image_url', 'name', 'username'],
    });
    for await (const tweet of searchedStream) {
      if (!tweet.data || !tweet.includes || !tweet.includes?.users?.[0].profile_image_url) {
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
}