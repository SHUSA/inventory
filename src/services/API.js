import axios from 'axios'
import store from '@/store/store'
const env = require('../../ecosystem.config').devSettings

// env taken from webpack
// to do: investigate why envs are not passing normally
const port = process.env.SERVER_PORT || 8081 // || env.SERVER_PORT
const host = 'http://' + (process.env.HOST || 'localhost' || env.HOST)

const baseURL = `${host}:${port}`

export default () => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
