import API from './API'
import checkResponse from './checkResponse'

export default {
  index (attributes = [], active = true) {
    return API().get('departments', {
      params: {
        attributes: attributes,
        active: active
      }
    }).catch(err =>
      checkResponse(err)
    )
  },

  post () {
    return API().post('departments').catch(err =>
      checkResponse(err)
    )
  },

  put (department) {
    return API().put(`departments/${department.id}`, {
      params: {
        department: department
      }
    }).catch(err =>
      checkResponse(err)
    )
  }
}
