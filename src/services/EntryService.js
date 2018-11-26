import API from './API'

export default {
  index () {
    return API().get('entries').catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (entryId) {
    return API().get(`entries/${entryId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  post (entry) {
    return API().post('entries', entry).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (entry) {
    return API().put(`entries/${entry.id}`, entry).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  delete (entry) {
    return API().delete(`entries/${entry.id}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
