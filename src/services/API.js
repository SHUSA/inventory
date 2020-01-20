import axios from 'axios'
import store from '@/store/store'

// env taken from webpack
// to do: investigate why envs are not passing normally
const port = process.env.SERVER_PORT || 8081
const host = 'http://' + (process.env.HOST || 'localhost')

const baseURL = `${host}:${port}`

export default () => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
