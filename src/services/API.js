import axios from 'axios'

export default () => {
  console.log('base Url')
  console.log(process.env.baseUrl)
  console.log(process.env.baseURL)
  return axios.create({
    baseURL: process.env.baseUrl || 'http://localhost:8081/'
  })
}
