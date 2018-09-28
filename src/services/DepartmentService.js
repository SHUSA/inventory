import API from './API'

export default {
  index () {
    return API().get('departments').catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
  },

  show (departmentId) {
    return API().get(`departments/${departmentId}`).catch(err =>
      JSON.parse(JSON.stringify(err)).response
    )
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
