import API from './API'

export default {
  index (active = true) {
    return API().get('entries', {
      params: {
        active: active
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (entryId) {
    return API().get(`entries/${entryId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  post (entries = []) {
    return API().post('entries', entries).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (entries = []) {
    return API().put(`entries`, entries).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  delete (entries = []) {
    return API().delete(`entries`, {
      params: {
        entries: entries
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
