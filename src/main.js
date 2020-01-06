// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './icons/fontawesome-free-5.6.3/css/all.min.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import Veutify from 'vuetify'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'
import store from '@/store/store'
import moment from 'moment'
import {clone, cloneDeep} from 'lodash'
import validate from './js/validate'
import utility from './js/utility'
import Scroll from '@/components/globals/Scroll.vue'
import Error from '@/components/globals/Error.vue'
import Popup from '@/components/globals/Popup.vue'

Vue.config.productionTip = false
Vue.use(Veutify, {
  iconfont: 'fa'
})

Vue.prototype.$moment = moment
Vue.prototype.$validate = validate
Vue.prototype.$util = utility
Vue.prototype.$clone = clone
Vue.prototype.$clonedeep = cloneDeep

Vue.component('scroll', Scroll)
Vue.component('error', Error)
Vue.component('popup', Popup)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
