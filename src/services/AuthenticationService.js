import API from './API'
import checkResponse from './checkResponse'

export default {
  register (credentials, department) {
    return API().post('register', {
      credentials: credentials,
      department: department
    }).catch(err =>
      checkResponse(err)
    )
  },

  userLogin (department) {
    return API().post('user-login', department).catch(err =>
      checkResponse(err)
    )
  },

  login (credentials) {
    return API().post('login', credentials).catch(err =>
      checkResponse(err)
    )
  },

  userupdate (user) {
    return API().post('userupdate', user).catch(err =>
      checkResponse(err)
    )
  },

  sessionCheck () {
    return API().post('sessioncheck').catch(err =>
      checkResponse(err)
    )
  }
}
