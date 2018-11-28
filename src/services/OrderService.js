import API from './API'

export default {
  index () {
    return API().get('orders').catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (orderId) {
    return API().get(`orders/${orderId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  post () {
    return API().post('orders').catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (order) {
    return API().put(`orders/${order.id}`, order).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  delete (orderId) {
    return API().delete(`orders/${orderId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
