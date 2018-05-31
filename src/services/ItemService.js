import API from './API'

export default {
  index () {
    return API().get('items')
  },

  show (itemId) {
    return API().get(`items/${itemId}`)
  },

  post (item) {
    return API().post('items', item)
  },

  put (itemId) {
    return API().put(`items/${itemId}`)
  }
}
