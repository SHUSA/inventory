import API from './API'

export default {
  index () {
    return API().get('orders').catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  show (orderId) {
    return API().get(`orders/${orderId}`).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  post () {
    return API().post('orders').catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  put (order) {
    return API().put(`orders/${order.id}`, order).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  delete () {
    return API().delete('orders').catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  }
}
