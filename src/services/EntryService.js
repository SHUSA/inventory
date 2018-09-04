import API from './API'

export default {
  index () {
    return API().get('entries').catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  show (entryId) {
    return API().get(`entries/${entryId}`).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  post (entry) {
    return API().post('entries', entry).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  },

  put (entry) {
    return API().put(`entries/${entry.id}`, entry).catch(err =>
      (JSON.parse(JSON.stringify(err)).response).data[0]
    )
  }
}
