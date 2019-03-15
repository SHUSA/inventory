import API from './API'
import checkResponse from './checkResponse'

export default {
  getUsers () {
    return API().get('auth/users/get').catch(err =>
      checkResponse(err)
    )
  },

  register (registration) {
    return API().post('auth/register', {
      registration: registration
    }).catch(err =>
      checkResponse(err)
    )
  },

  userLogin (department) {
    return API().post('auth/user/login', department).catch(err =>
      checkResponse(err)
    )
  },

  login (credentials) {
    return API().post('auth/admin/login', credentials).catch(err =>
      checkResponse(err)
    )
  },

  userUpdate (user) {
    return API().post('auth/user/update', user).catch(err =>
      checkResponse(err)
    )
  },

  sessionCheck () {
    return API().post('auth/user/session').catch(err =>
      checkResponse(err)
    )
  }
}
