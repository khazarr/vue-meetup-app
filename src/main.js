
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyA1-aKXUHlUXjM8Mgc-4nESFpEAqqHcB_I',
      authDomain: 'vue-meetup-yt.firebaseapp.com',
      databaseURL: 'https://vue-meetup-yt.firebaseio.com',
      projectId: 'vue-meetup-yt',
      storageBucket: 'vue-meetup-yt.appspot.com'
    })

    this.$store.dispatch('loadMeetups')
  }
})
