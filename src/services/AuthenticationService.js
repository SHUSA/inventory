import API from './API'

export default {
  register (credentials) {
    return API().get('register', credentials).catch(err =>
      JSON.stringify(JSON.parse(JSON.stringify(err)).response)
    )
  },

  login (credentials) {
    return API().get('login', credentials).catch(err =>
      JSON.stringify(JSON.parse(JSON.stringify(err)).response)
    )
  },

  userupdate (user) {
    return API().post('userupdate', user).catch(err =>
      JSON.stringify(JSON.parse(JSON.stringify(err)).response)
    )
  }
}
