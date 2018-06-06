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
    return API().post('assays', assay)
  },

  put (assayId) {
    return API().put(`assays/${assayId}`)
  }
}
