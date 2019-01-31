import API from './API'
import checkResponse from './checkResponse'

export default {
  register (credentials) {
    return API().post('register', credentials).catch(err =>
      checkResponse(err)
    )
  },

  login (credentials) {
    return API().post('login', credentials).catch(err =>
      checkResponse(err)
    )
  },

  userupdate (user) {
    return API().put('userupdate', user).catch(err =>
      checkResponse(err)
    )
  }
}
