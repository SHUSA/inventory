import API from './API'
import checkResponse from './checkResponse'

export default {
  index () {
    return API().get('departments').catch(err =>
      checkResponse(err)
    )
  },

  show (departmentId) {
    return API().get(`departments/${departmentId}`).catch(err =>
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
