import API from './API'

export default {
  index (status) {
    return API().get('vendors', {
      params: {
        status: status
      }
    })
  },

  show (vendorId) {
    return API().get(`vendors/${vendorId}`)
  },

  post (vendor) {
    return API().post('vendors', vendor)
  },

  put (vendorId) {
    return API().put(`vendors/${vendorId}`)
  }
}
