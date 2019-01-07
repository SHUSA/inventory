import API from './API'
import checkResponse from './checkResponse'

export default {
  register (credentials) {
    return API().get('register', credentials).catch(err =>
      checkResponse(err)
    )
  },

  login (credentials) {
    return API().get('login', credentials).catch(err =>
      checkResponse(err)
    )
  },

  userupdate (user) {
    return API().post('userupdate', user).catch(err =>
      checkResponse(err)
    )
  }
}
