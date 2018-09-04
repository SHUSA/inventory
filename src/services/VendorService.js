import API from './API'

export default {
  index (status) {
    return API().get('vendors', {
      params: {
        status: status
      }
    }).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  show (vendorId) {
    return API().get(`vendors/${vendorId}`).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  post (vendor) {
    return API().post('vendors', vendor).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  put (vendor) {
    return API().put(`vendors/${vendor.id}`, vendor).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  }
}
