import API from './API'

export default {
  index () {
    return API().get('assays')
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
