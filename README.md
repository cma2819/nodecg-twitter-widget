# nodecg-twitter-widget
NodeCG layout bundle for showing tweet.

## Requirements

- `nodecg ^1.1.1`

## Installation

```
git clone https://github.com/cma2819/nodecg-twitter-widget.git
```

or

```
git install cma2819/nodecg-twitter-widget
```

## Configuration

[configschema.json](./configschema.json)

```
{
  "activeSeconds": 30,
  "listMaximum": 50,
  "twitter": {
    "targetWords": [
      "NodeCG", "RTA"
    ],
    "bearer": "<bearer token from Twitter developer dashboard>"
  },
  "findOption": {
    "removeRetweet": false // set true if you want to remove retweet from stream
  }
}
```

## Types

- [ActiveTweet](./src/nodecg/generated/activeTweet.d.ts)