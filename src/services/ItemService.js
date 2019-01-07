import API from './API'
import checkResponse from './checkResponse'

export default {
  index (attributes = [], active = true) {
    return API().get('items', {
      params: {
        attributes: attributes,
        active: active
      }
    }).catch(err =>
      checkResponse(err)
    )
  },

  show (ids, active = true) {
    return API().get('items/list', {
      params: {
        ids: ids,
        active: active
      }
    }).catch(err =>
      checkResponse(err)
    )
  },

  post (item, assay) {
    return API().post('items', {
      params: {
        item: item,
        assay: assay
      }
    }).catch(err =>
      checkResponse(err)
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
      checkResponse(err)
    )
  },

  deactivate (id) {
    // send either AssayId or VendorId
    return API().put('items', {
      params: {
        id: id
      }
    }).catch(err =>
      checkResponse(err)
    )
  }
}
