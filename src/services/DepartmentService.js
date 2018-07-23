import API from './API'

export default {
  index () {
    return API().get('departments').catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  show (departmentId) {
    return API().get(`departments/${departmentId}`).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  post () {
    return API().post('departments').catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  },

  put (department) {
    return API().put(`departments/${department.id}`, {
      params: {
        department: department
      }
    }).catch(err =>
      alert((JSON.parse(JSON.stringify(err)).response).data[0].message)
    )
  }
}
