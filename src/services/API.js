import axios from 'axios'

export default () => {
  console.log('axios')
  console.log(process.env)
  return axios.create({
    baseURL: process.env.baseURL
  })
}
