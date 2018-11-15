import API from './API'

export default {
  index (search, attributes = []) {
    return API().get('vendors', {
      params: {
        search: search,
        attributes: attributes
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
