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
    user: false,
    admin: false
  },
  mutations: {
    setUser (state, type) {
      for (let key in state) {
        if (key === type) {
          state[key] = !state[key]
        } else {
          state[key] = false
        }
      }
    }
  },
  actions: {
    setUser ({ commit }, type) {
      commit('setUser', type)
    }
  }
})
