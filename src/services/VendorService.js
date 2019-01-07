import API from './API'
import checkResponse from './checkResponse'

export default {
  index (attributes = [], active = true) {
    return API().get('vendors', {
      params: {
        attributes: attributes,
        active: active
      }
    }).catch(err =>
      checkResponse(err)
    )
  },

  show (vendorId) {
    return API().get(`vendors/${vendorId}`).catch(err =>
      checkResponse(err)
    )
  },

  post (vendor) {
    return API().post('vendors', vendor).catch(err =>
      checkResponse(err)
    )
  },

  put (vendor) {
    return API().put(`vendors/${vendor.id}`, vendor).catch(err =>
      checkResponse(err)
    )
  }
}
