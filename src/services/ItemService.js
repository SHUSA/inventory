import API from './API'

export default {
  index (status) {
    return API().get('items', {
      params: {
        status: status
      }
    }).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  show (itemIds) {
    return API().get('items/list', {
      params: {
        itemIds: itemIds
      }
    }).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  post (item, assay) {
    return API().post('items', {
      params: {
        item: item,
        assay: assay
      }
    }).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  put (itemId, item, assay) {
    return API().put(`items/${itemId}`, {
      params: {
        item: item,
        assay: assay
      }
    }).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  }
}
