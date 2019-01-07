import API from './API'
import checkResponse from './checkResponse'

export default {
  index (active = true) {
    return API().get('entries', {
      params: {
        active: active
      }
    }).catch(err =>
      checkResponse(err)
    )
  },

  show (entryId) {
    return API().get(`entries/${entryId}`).catch(err =>
      checkResponse(err)
    )
  },

  post (entries = []) {
    return API().post('entries', entries).catch(err =>
      checkResponse(err)
    )
  },

  put (entries = []) {
    return API().put(`entries`, entries).catch(err =>
      checkResponse(err)
    )
  },

  delete (entries = []) {
    return API().delete(`entries`, {
      params: {
        entries: entries
      }
    }).catch(err =>
      checkResponse(err)
    )
  }
}
