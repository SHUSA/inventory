import API from './API'

export default {
  index (attributes = [], active = true) {
    return API().get('vendors', {
      params: {
        attributes: attributes,
        active: active
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (vendorId) {
    return API().get(`vendors/${vendorId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  post (vendor) {
    return API().post('vendors', vendor).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (vendor) {
    return API().put(`vendors/${vendor.id}`, vendor).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
