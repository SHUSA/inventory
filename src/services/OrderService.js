import API from './API'

export default {
  index () {
    return API().get('orders')
  },

  show (orderId) {
    return API().get(`orders/${orderId}`)
  },

  post (order) {
    return API().post('orders', order)
  },

  put (orderId) {
    return API().put(`orders/${orderId}`)
  }
}
