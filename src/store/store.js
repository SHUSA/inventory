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
    token: null,
    userId: null,
    isUserLoggedIn: false,
    isAdminLoggedIn: false,
    storedOrder: '',
    storedFilters: [],
    itemList: [],
    assayList: [],
    vendorList: [],
    catalogNumbers: [],
    assayNames: [],
    vendorNames: []
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
    setOrder (state, data) {
      state.storedOrder = data
    },
    setFilters (state, data) {
      state.storedFilters = data
    },
    setItems (state, data) {
      state.itemList = data
    },
    setAssays (state, data) {
      state.assayList = data
    },
    setVendors (state, data) {
      state.vendorList = data
    },
    setCatalogNumbers (state, data) {
      state.catalogNumbers = data
    },
    setAssayNames (state, data) {
      state.assayNames = data
    },
    setVendorNames (state, data) {
      state.vendorNames = data
    }
  },
  actions: {
    setUser ({ commit }, type) {
      commit('setUser', type)
    },
    setTitle ({ commit }, title) {
      commit('setTitle', title)
    },
    setOrder ({ commit }, data) {
      commit('setOrder', data)
    },
    setFilters ({ commit }, data) {
      commit('setFilters', data)
    },
    setItems ({ commit }, data) {
      commit('setItems', data)
    },
    setAssays ({ commit }, data) {
      commit('setAssays', data)
    },
    setVendors ({ commit }, data) {
      commit('setVendors', data)
    },
    setCatalogNumbers ({ commit }, data) {
      commit('setCatalogNumbers', data)
    },
    setAssayNames ({ commit }, data) {
      commit('setAssayNames', data)
    },
    setVendorNames ({ commit }, data) {
      commit('setVendorNames', data)
    }
  }
})
