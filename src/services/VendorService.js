import API from './API'

export default {
  index () {
    return API().get('vendors')
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
