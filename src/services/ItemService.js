import API from './API'

export default {
  index (status) {
    return API().get('items', {
      params: {
        status: status
      }
    }).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  show (itemIds) {
    return API().get('items/list', {
      params: {
        itemIds: itemIds
      }
    }).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  post (item, assay) {
    return API().post('items', {
      params: {
        item: item,
        assay: assay
      }
    }).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  put (itemId, item, assay) {
    return API().put(`items/${itemId}`, {
      params: {
        item: item,
        assay: assay
      }
    }).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  }
}
