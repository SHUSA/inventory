import API from './API'

export default {
  index () {
    return API().get('entries')
  },

  show (entryId) {
    return API().get(`entries/${entryId}`)
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
  }
}
