import API from './API'
import checkResponse from './checkResponse'

export default {
  index (attributes = [], active = true) {
    return API().get('assays', {
      params: {
        attributes: attributes,
        active: active
      }
    }).catch(err =>
      checkResponse(err)
    )
  },

  show (assayId) {
    return API().get(`assays/${assayId}`).catch(err =>
      checkResponse(err)
    )
  },

  post (assay) {
    return API().post('assays', assay).catch(err =>
      checkResponse(err)
    )
  },

  put (assay) {
    return API().put(`assays/${assay.id}`, assay).catch(err =>
      checkResponse(err)
    )
  }
}
