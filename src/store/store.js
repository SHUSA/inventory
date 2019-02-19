import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

function initialState () {
  return {
    user: {
      id: '',
      username: '',
      email: '',
      isAdmin: false,
      passwordHint: '',
      department: {},
      itemDefaults: {},
      assayDefaults: {},
      isUserLoggedIn: false
    },
    token: null,
    welcome: '',
    pageTitle: '',
    storedOrder: '',
    storedFilters: [],
    itemList: [],
    assayList: [],
    vendorList: [],
    catalogNumbers: [],
    assayNames: [],
    vendorNames: [],
    snackbar: {
      open: false,
      text: '',
      color: 'primary',
      icon: ''
    }
  }
}

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: initialState(),
  mutations: {
    resetAll (state) {
      const initial = initialState()
      Object.keys(initial).forEach(key => {
        state[key] = initial[key]
      })
    },
    setUser (state, user) {
      if (user === 'user') {
        state.welcome = 'Hello User!'
      } else {
        state.user = Object.assign(state.user, {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          passwordHint: user.passwordHint
        })
        state.user.department = user.Department
        state.welcome = `Hello ${state.user.username}!`
      }
    },
    setToken (state, token) {
      // to do: account for general user vs admin
      state.token = token
      if (token) {
        state.user.isUserLoggedIn = true
      } else {
        state.user.isUserLoggedIn = false
      }
    },
    setSettings (state, settings) {
      state.user.itemDefaults = settings.itemDefaults
      state.user.assayDefaults = settings.assayDefaults
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
    },
    closeSnack (state) {
      state.snackbar.open = false
    },
    setSnack (state, snack) {
      if (snack.color === 'error' && !snack.icon) {
        snack.icon = 'fa-exclamation-triangle'
      }
      const settings = Object.assign({open: true}, snack)
      state.snackbar = Object.assign({}, initialState().snackbar, settings)
    }
  },
  actions: {
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setSettings ({ commit }, settings) {
      commit('setSettings', settings)
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
    },
    setSnack ({ commit }, snack) {
      if (snack.open !== false) {
        commit('closeSnack')
      }
      setTimeout(() => {
        commit('setSnack', snack)
      }, 100)
    },
    resetAll ({ commit }) {
      commit('resetAll')
    }
  }
})
