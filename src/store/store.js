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
    welcome: '',
    pageTitle: '',
    drawer: true,
    token: null,
    userId: null,
    isUserLoggedIn: false,
    isAdminLoggedIn: false,
    itemInfo: {},
    assayInfo: {},
    selectedAssays: []
  },
  mutations: {
    setUser (state, type) {
      for (let key in state.users) {
        if (key === type) {
          // always true for testing
          state.welcome = `Hello ${type}!`
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
    setDrawer (state, open) {
      // initialize drawer to close
      state.drawer = open !== undefined ? open : !state.drawer
    },
    setItemInfo (state, data) {
      state.itemInfo = data
    },
    setAssayInfo (state, data) {
      state.assayInfo = data
    },
    setSelectedAssay (state, data) {
      state.selectedAssays = data
    }
  },
  actions: {
    setUser ({ commit }, type) {
      commit('setUser', type)
    },
    setTitle ({ commit }, title) {
      commit('setTitle', title)
    },
    setDrawer ({ commit }, open) {
      commit('setDrawer', open)
    },
    setItemInfo ({ commit }, data) {
      commit('setItemInfo', data)
    },
    setAssayInfo ({ commit }, data) {
      commit('setAssayInfo', data)
    },
    setSelectedAssay ({ commit }, data) {
      commit('setSelectedAssay', data)
    }
  }
})
