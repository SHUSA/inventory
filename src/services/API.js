import axios from 'axios'
// for dev purposes
// baseURL: process.env.HOST || 'http://localhost:8081/'
export default () => {
  return axios.create({
    baseURL:  process.env.HOST || 'http://localhost:8081/'
  })
}
