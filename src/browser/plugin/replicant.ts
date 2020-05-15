import { VuexModule, getModule, Module, Mutation } from 'vuex-module-decorators';
import store from './store';
import { ReplicantName } from '../../nodecg/replicants';
import clone from 'clone';
import { TweetDataArray } from '../../nodecg/generated/tweetDataArray';
import { ActiveTweet } from '../../nodecg/generated/activeTweet';

@Module({ dynamic: true, store, name: 'replicant', namespaced: true })
class Replicant extends VuexModule {
    activeTweet: ActiveTweet = null;
    tweetDataArray: TweetDataArray = [];

    @Mutation
    public updateActiveTweet(value: ActiveTweet): void {
        this.activeTweet = value;
    }

    @Mutation
    public updateTweetDataArray(value: TweetDataArray): void {
        this.tweetDataArray = value;
    }
}

export const replicantModule = getModule(Replicant);

const replicantMutations: [ReplicantName, Function][] = [
    ['activeTweet', replicantModule.updateActiveTweet],
    ['tweetDataArray', replicantModule.updateTweetDataArray]
];

replicantMutations.forEach(([name, mutator]) => {
    const replicant = nodecg.Replicant(name);

    replicant.on('change', (newVal) => {
        mutator(clone(newVal));
    });
});
