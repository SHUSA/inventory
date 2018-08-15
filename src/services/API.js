import axios from 'axios'
const config = require('../../server/config/config')
// for dev purposes
// baseURL: process.env.HOST || 'http://localhost:8081/'

let baseURL = `${config.host}:${config.port}` || 'http://localhost:8081/'
export default () => {
  return axios.create({
    baseURL: baseURL
  })
}
