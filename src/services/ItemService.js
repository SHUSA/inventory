import API from './API'

export default {
  index (search, attributes = []) {
    return API().get('items', {
      params: {
        search: search,
        attributes: attributes
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (itemIds) {
    return API().get('items/list', {
      params: {
        itemIds: itemIds
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
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

  put (itemId, item, assay = null, list = []) {
    // use list for multiple item updates
    return API().put(`items/${itemId}`, {
      params: {
        item: item,
        assay: assay,
        list: list
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
