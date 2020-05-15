<template>
  <v-card
    class="ma-2"
    light
  >
    <v-card-subtitle
      class="py-1"
      :style="{
        overflowX: 'hidden'
      }"  
    >
      <v-list-item-avatar>
        <v-img
          v-if="tweet.profileImageUrl"
          class="elevation-6"
          :src=" tweet.profileImageUrl"
        ></v-img>
        <v-icon
          v-else
        >
          fab fa-twitter
        </v-icon>
      </v-list-item-avatar>
      <div
        :style="{
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }"
      >
        {{ tweet.name }}
        <span
          class="body-2 ml-2"
        >@{{ tweet.screenName }}</span>
      </div>
    </v-card-subtitle>
    <v-card-text class="body-2 py-1">
      <span class="black--text">{{ tweet.text }}</span>
    </v-card-text>
    <v-card-actions>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            class="mx-2 white--text"
            light
            fab
            small
            :color="colors.twitter.primary"
            v-on="on"
            @click="activate"
          >
            <v-icon small>
              fas fa-level-up-alt
            </v-icon>
          </v-btn>
        </template>
        <span>Go on live</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { COLORS } from '../../plugin/styles';
import { Tweet } from '../../../nodecg/generated/tweet';
import { twitterModule } from '../twitter';

@Component
export default class TweetCard extends Vue {
  @Prop(Object)
  readonly tweet!: Tweet;
  readonly colors = COLORS;

  @Emit()
  activate(): void {
    twitterModule.activateTweet(this.tweet.id);
  }
}
</script>