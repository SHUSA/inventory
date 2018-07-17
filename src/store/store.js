import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    // set to true for testing
    users: {
      user: true,
      admin: true
    },
    pageTitle: '',
    drawer: true,
    token: null,
    userId: null,
    isUserLoggedIn: false,
    isAdminLoggedIn: false,
    infoTab: null
  },
  mutations: {
    setUser (state, type) {
      for (let key in state.users) {
        if (key === type) {
          // always true for testing
          state[key] = true
        } else {
          // set to true for testing
          state[key] = false
        }
      }
    },
    setTitle (state, title) {
      state.pageTitle = title
    },
    setDrawer (state) {
      state.drawer = !state.drawer
    },
    setTabInfo (state, data) {
      state.infoTab = data
    }
  },
  actions: {
    setUser ({ commit }, type) {
      commit('setUser', type)
    },
    setTitle ({ commit }, title) {
      commit('setTitle', title)
    },
    setDrawer ({ commit }) {
      commit('setDrawer')
    },
    setTabInfo ({ commit }, data) {
      commit('setTabInfo', data)
    }
  }
})
