<template>
  <v-app :style="{height: '720px', maxHeight: '100%', overflowX: 'hidden', overflowY: 'scroll'}">
    <v-overlay
      :value="(activeTweet !== null)"
      opacity="0.9"
    >
      <v-progress-circular
        indeterminate
        size="32"
      ></v-progress-circular>
      Displaying Tweet...
    </v-overlay>
    <transition-group name="tweet">
      <tweet-card
        v-for="tweet in tweetDataArray"
        :key="tweet.id"
        :tweet="tweet"
      ></tweet-card>
    </transition-group>
  </v-app>
</template>

<style scoped>
.tweet-enter-active, .tweet-leave-active {
  transition: all 1s;
}

.tweet-enter, .tweet-leave-to {
  opacity:0;
  transform: translateX(50px);
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TweetCard from './components/TweetCard.vue';
import { replicantModule as replicant } from '../plugin/replicant';
import { TweetDataArray } from '../../nodecg/generated/tweetDataArray';
import { ActiveTweet } from '../../nodecg/generated/activeTweet';

@Component({
  components: {
    TweetCard
  }
})
export default class App extends Vue {
  get tweetDataArray(): TweetDataArray {
    return replicant.tweetDataArray;
  }

  get activeTweet(): ActiveTweet {
    return replicant.activeTweet;
  }
  
}
</script>
