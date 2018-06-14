import API from './API'

export default {
  index (item, status, search) {
    return API().get('items', {
      params: {
        item: item,
        status: status,
        search: search
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
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (itemId, item, assay) {
    return API().put(`items/${itemId}`, {
      params: {
        item: item,
        assay: assay
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
