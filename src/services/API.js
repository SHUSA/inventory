import axios from 'axios'

// env taken from webpack
const port = process.env.PORT || 8081
const host = process.env.HOST || 'http://localhost'

let baseURL = `${host}:${port}`

export default () => {
  return axios.create({
    baseURL: baseURL
  })
}
