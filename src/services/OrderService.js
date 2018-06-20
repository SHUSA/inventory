import API from './API'

export default {
  index () {
    return API().get('orders')
  },

  show (orderId) {
    return API().get(`orders/${orderId}`)
  },

  post () {
    return API().post('orders').catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (order) {
    return API().put(`orders/${order._id}`, {
      params: {
        order: order
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
