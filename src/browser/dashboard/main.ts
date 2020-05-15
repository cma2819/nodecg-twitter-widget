/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from 'vue';
import store from '../plugin/store';
import vuetify from '../plugin/vuetify';
import App from './main.vue';

new Vue({
    store,
    vuetify,
    el: '#app',
    render: (h) => h(App),
});
