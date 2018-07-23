import API from './API'

export default {
  index () {
    return API().get('entries').catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  },

  show (entryId) {
    return API().get(`entries/${entryId}`).catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  },

  post (entry) {
    return API().post('entries', entry).catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  },

  put (entry) {
    return API().put(`entries/${entry.id}`, entry).catch(err =>
      alert(JSON.stringify(JSON.parse(JSON.stringify(err)).response))
    )
  }
}
