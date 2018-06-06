import API from './API'

export default {
  index (status) {
    return API().get('items', {
      params: {
        status: status
      }
    })
  },

  show (itemId) {
    return API().get(`items/${itemId}`)
  },

  post (item, assay) {
    return API().post('items', {
      params: {
        item: item,
        assay: assay
      }
    })
  },

  put (itemId, item, assay) {
    return API().put(`items/${itemId}`, {
      params: {
        item: item,
        assay: assay
      }
    })
  }
}
