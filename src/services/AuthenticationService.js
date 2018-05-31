import API from './API'

export default {
  register (credentials) {
    return API().get('register', credentials)
  },

  login (credentials) {
    return API().get('login', credentials)
  },

  userupdate (user) {
    return API().post('userupdate', user)
  }
}
