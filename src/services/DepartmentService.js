import API from './API'

export default {
  index () {
    return API().get('departments')
  },

  show (departmentId) {
    return API().get(`departments/${departmentId}`)
  },

  post () {
    return API().post('departments').catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  put (department) {
    return API().put(`departments/${department.id}`, {
      params: {
        department: department
      }
    }).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  }
}
