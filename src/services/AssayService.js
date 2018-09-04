import API from './API'

export default {
  index (status) {
    return API().get('assays', {
      params: {
        status: status
      }
    }).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  show (assayId) {
    return API().get(`assays/${assayId}`).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  post (assay) {
    return API().post('assays', assay).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  put (assay) {
    return API().put(`assays/${assay.id}`, assay).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  }
}
