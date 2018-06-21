import axios from 'axios'
// for dev purposes
// baseURL: process.env.baseURL || 'http://localhost:8081/'
export default () => {
  return axios.create({
    baseURL: process.env.baseURL
  })
}
