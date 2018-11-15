import API from './API'

export default {
  index (search) {
    return API().get('assays', {
      params: {
        search: search
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (assayId) {
    return API().get(`assays/${assayId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  post (assay) {
    return API().post('assays', assay).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (assay) {
    return API().put(`assays/${assay.id}`, assay).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
