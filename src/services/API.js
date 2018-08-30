import axios from 'axios'

// env taken from webpack
const port = process.env.PORT || 8081
const host = process.env.HOST || 'localhost'

let baseURL = `${host}:${port}`
baseURL = host === 'localhost' ? 'http://' + baseURL : baseURL

export default () => {
  return axios.create({
    baseURL: baseURL
  })
}
