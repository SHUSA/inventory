import API from './API'

export default {
  index () {
    return API().get('orders').catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  show (orderId) {
    return API().get(`orders/${orderId}`).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  post () {
    return API().post('orders').catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  put (order) {
    return API().put(`orders/${order.id}`, order).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  delete () {
    return API().delete('orders').catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  }
}
