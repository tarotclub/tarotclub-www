import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Vuetify from 'vuetify/lib';

import App from './App.vue'
import router from './router.js'
import store from './store/AppStore'
import Api from './Api.js'
import TarotClient from './tarot-client.js'
import ReconnectingWebSocket from 'reconnecting-websocket';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Vuetify);

const opts = ({
  icons: {
    iconfont: 'mdi',
  },
  
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light:
        {
          background: '#e3e2df', 
          primary: '#9c27b0',
          secondary:'#009688',
          accent: '#2196f3',
          error: '#f44336',
          warning: '#ff5722',
          info: '#3f51b5',
          success: '#4caf50'
      }
    },
    dark: false,
  }
});

Vue.config.productionTip = false;

Vue.prototype.$api = new Api();
Vue.prototype.$tc = new TarotClient();
Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  vuetify: new Vuetify(opts),
  router,
  store,

  render: h => h(App),
  //====================================================================================================================
  beforeCreate: function() {
    this.$api.loadToken();
    this.$api.getMyProfile().then((response) => {

        if (response.success) {
          this.$store.commit('user/LOGIN_SUCCESS', response.data.profile);
        } else {
          console.log("Not logged in.");
          this.$store.commit('user/LOGIN_FAILURE');
          this.$store.commit('SET_INITIALIZED', true);
        }
    }).catch((error) => {
      console.log(error);
    });
  },
  //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.$off('sendToServer');
  },
  //====================================================================================================================
  created() {

  }

  
}).$mount('#app')

