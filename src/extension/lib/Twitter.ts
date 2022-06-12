import needle from 'needle';

const TWITTER_API_V2 = 'https://api.twitter.com/2';

export type RuleOptions = {
  retweet?: boolean;
}

export type TwitterCredentials = {
  consumerKey: string;
  consumerSecret: string;
};

type TwitterRule = {
  value: string;
  tag?: string;
};

type TwitterRuleResponses = ({
  id: string;
} & TwitterRule)[];

export class Twitter {

  protected bearer?: string;

  constructor(protected credentials: TwitterCredentials, protected errorHandler: (err: Error) => void) {
    needle.post('https://api.twitter.com/oauth2/token?grant_type=client_credentials', {}, {
      headers: {
        'Authorization': `Basic ${credentials.consumerKey}:${credentials.consumerSecret}`,
      },
    }, (err, response) => {
      if (err) {
        this.errorHandler(new Error(`OAuth2 credentials error.\n${err}`));
        return;
      }

      console.log(`Basic ${credentials.consumerKey}:${credentials.consumerSecret}`);
      this.bearer = response.body;
    });
  }

  private resetRules(): void {
    console.log(this.bearer);
    // fetch rules
    needle.get(`${TWITTER_API_V2}/tweets/search/stream/rules`, {
      headers: {
        'Authorization': `Bearer ${this.bearer}`,
      },
    }, (err, response) => {
      if (err) {
        this.errorHandler(err);
      }

      const rules = response.body.data as TwitterRuleResponses;
      const ruleIds = rules.map((rule) => rule.id);

      // delete rules
      needle.post(
        `${TWITTER_API_V2}/tweets/search/stream/rules`,
        {
          delete: { ids: ruleIds }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.bearer}`,
          },
        },
        (err) => {
          if (err) {
            this.errorHandler(err);
          }
      });
    });
  }

  startStream(trackWords: string[], option: RuleOptions, onTweet: () => void): void {
    return;
    this.resetRules();
    onTweet();
    console.log(TWITTER_API_V2);
    console.log(trackWords);
    console.log(option);
  }
}