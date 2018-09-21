import axios from 'axios'

// env taken from webpack
const port = process.env.PORT || 8081
const host = 'http://' + (process.env.HOST || 'localhost')

let baseURL = `${host}:${port}`

export default () => {
  return axios.create({
    baseURL: baseURL
  })
}
