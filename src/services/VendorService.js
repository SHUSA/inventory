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
    return API().post('vendors', vendor).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (vendor, origName) {
    return API().put(`vendors/${vendor._id}`, {
      params: {
        vendor: vendor,
        origName: origName
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
