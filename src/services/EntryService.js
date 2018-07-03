import API from './API'

export default {
  index () {
    return API().get('entries')
  },

  show (entryId) {
    return API().get(`entries/${entryId}`)
  },

  post () {
    return API().post('entries').catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (entry) {
    return API().put(`entries/${entry.id}`, {
      params: {
        entry: entry
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
