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
    mode: '',
    token: null,
    userId: null,
    isUserLoggedIn: false,
    isAdminLoggedIn: false,
    storedOrder: {},
    storedFilters: [],
    itemDialog: false,
    assayDialog: false,
    vendorDialog: false,
    itemSave: false,
    assaySave: false,
    vendorSave: false
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
    setMode (state, mode) {
      state.mode = mode
    },
    setOrder (state, data) {
      state.storedOrder = data
    },
    setFilters (state, data) {
      state.storedFilters = data
    }
    // setItemDialog (state, open) {
    //   state.itemDialog = open
    // },
    // setAssayDialog (state, open) {
    //   state.assayDialog = open
    // },
    // setVendorDialog (state, open) {
    //   state.vendorDialog = open
    // },
    // setItemSave (state, saved) {
    //   state.itemSave = saved
    // },
    // setAssaySave (state, saved) {
    //   state.assaySave = saved
    // },
    // setVendorSave (state, saved) {
    //   state.vendorSave = saved
    // }
  },
  actions: {
    setUser ({ commit }, type) {
      commit('setUser', type)
    },
    setTitle ({ commit }, title) {
      commit('setTitle', title)
    },
    setMode ({ commit }, mode) {
      commit('setMode', mode)
    },
    setOrder ({ commit }, data) {
      commit('setOrder', data)
    },
    setFilters ({ commit }, data) {
      commit('setFilters', data)
    }
    // setItemDialog ({ commit }, open) {
    //   commit('setItemDialog', open)
    // },
    // setAssayDialog ({ commit }, open) {
    //   commit('setAssayDialog', open)
    // },
    // setVendorDialog ({ commit }, open) {
    //   commit('setVendorDialog', open)
    // },
    // setItemSave ({ commit }, saved) {
    //   commit('setItemSave', saved)
    // },
    // setAssaySave ({ commit }, saved) {
    //   commit('setAssaySave', saved)
    // },
    // setVendorSave ({ commit }, saved) {
    //   commit('setVendorSave', saved)
    // }
  }
})
