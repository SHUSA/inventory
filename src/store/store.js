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
    user: true,
    admin: true,
    pageTitle: 'test'
  },
  mutations: {
    setUser (state, type) {
      for (let key in state) {
        if (key === type) {
          // always true for testing
          state[key] = state[key]
        } else {
          // set to true for testing
          state[key] = state[key]
        }
      }
    },
    setTitle (state, title) {
      state.pageTitle = title
    }
  },
  actions: {
    setUser ({ commit }, type) {
      commit('setUser', type)
    },
    setTitle ({ commit }, title) {
      commit('setTitle', title)
    }
  }
})
