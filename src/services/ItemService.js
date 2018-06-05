import API from './API'

export default {
  index () {
    return API().get('items')
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
