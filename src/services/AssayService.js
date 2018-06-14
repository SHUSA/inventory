import API from './API'

export default {
  index (status) {
    return API().get('assays', {
      params: {
        status: status
      }
    })
  },

  show (assayId) {
    return API().get(`assays/${assayId}`)
  },

  post (assay) {
    return API().post('assays', assay).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (assayId) {
    return API().put(`assays/${assayId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
