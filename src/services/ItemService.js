import API from './API'

export default {
  index (attributes = [], active = true) {
    return API().get('items', {
      params: {
        attributes: attributes,
        active: active
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (ids, active = true) {
    return API().get('items/list', {
      params: {
        ids: ids,
        active: active
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
