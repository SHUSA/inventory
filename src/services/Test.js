import API from './API'

export default {
  index (search) {
    return API().get('test', {
      params: {
        search: search
      }
    })
  },

  post (test) {
    return API().post('test', test)
  },

  put (test) {
    return API().put('test', test)
  }
}
