import API from './API'
import checkResponse from './checkResponse'

export default {
  show (tableName, id) {
    return API().post(`history`, {
      params: {
        tableName: tableName,
        rowId: id
      }
    }).catch(err =>
      checkResponse(err)
    )
  }
}
