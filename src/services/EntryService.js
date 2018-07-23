import API from './API'

export default {
  index () {
    return API().get('entries').catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  show (entryId) {
    return API().get(`entries/${entryId}`).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  post (entry) {
    return API().post('entries', entry).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  put (entry) {
    return API().put(`entries/${entry.id}`, entry).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  }
}
