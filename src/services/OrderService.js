import API from './API'
import checkResponse from './checkResponse'

export default {
  index (active = true) {
    return API().get('orders', {
      params: {
        active: active
      }
    }).catch(err =>
      checkResponse(err)
    )
  },

  show (orderId) {
    return API().get(`orders/${orderId}`).catch(err =>
      checkResponse(err)
    )
  },

  post () {
    return API().post('orders').catch(err =>
      checkResponse(err)
    )
  },

  put (order) {
    return API().put(`orders/${order.id}`, order).catch(err =>
      checkResponse(err)
    )
  },

  delete (orderId) {
    return API().delete(`orders/${orderId}`).catch(err =>
      checkResponse(err)
    )
  }
}
