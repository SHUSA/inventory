import API from './API'

export default {
  index (status) {
    return API().get('assays', {
      params: {
        status: status
      }
    }).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  show (assayId) {
    return API().get(`assays/${assayId}`).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  post (assay) {
    return API().post('assays', assay).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  put (assay) {
    return API().put(`assays/${assay.id}`, assay).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  }
}
