import API from './API'

export default {
  index () {
    return API().get('test')
  },

  post (test) {
    return API().post('test', test)
  },

  put (test) {
    return API().put('test', test)
  }
}
