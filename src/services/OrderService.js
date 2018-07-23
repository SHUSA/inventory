import API from './API'

export default {
  index () {
    return API().get('orders').catch(err =>
      alert(JSON.parse(JSON.stringify(err)).response)
    )
  },

  show (orderId) {
    return API().get(`orders/${orderId}`).catch(err =>
      alert(JSON.parse(JSON.stringify(err)).response)
    )
  },

  post () {
    return API().post('orders').catch(err =>
      alert(JSON.parse(JSON.stringify(err)).response)
    )
  },

  put (order) {
    return API().put(`orders/${order.id}`, order).catch(err =>
      alert(JSON.parse(JSON.stringify(err)).response)
    )
  },

  delete () {
    return API().delete('orders').catch(err =>
      alert(JSON.parse(JSON.stringify(err)).response)
    )
  }
}
