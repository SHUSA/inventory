import API from './API'

export default {
  index (status) {
    return API().get('assays', {
      params: {
        status: status
      }
    }).catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  },

  show (assayId) {
    return API().get(`assays/${assayId}`).catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  },

  post (assay) {
    return API().post('assays', assay).catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  },

  put (assay) {
    return API().put(`assays/${assay.id}`, assay).catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  }
}
