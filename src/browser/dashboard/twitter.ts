import { Module, getModule, VuexModule, Action } from 'vuex-module-decorators';
import store from '../plugin/store';

@Module({ dynamic: true, store, name: 'twitter', namespaced: true })
class Twitter extends VuexModule {
    @Action
    public activateTweet(id: number): void {
        nodecg.sendMessage('twitter:activate', id);
    }
}

export const twitterModule = getModule(Twitter);