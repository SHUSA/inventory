import axios from 'axios'
const config = require('../../server/config/config')

let baseURL = `${config.host}:${config.port}`
baseURL = baseURL === 'localhost:8081' ? 'http://' + baseURL : baseURL

export default () => {
  return axios.create({
    baseURL: baseURL
  })
}
