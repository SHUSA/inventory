import axios from 'axios'
import store from '@/store/store'

// env taken from webpack
const port = process.env.SERVER_PORT || 8081
const host = 'http://' + (process.env.HOST || 'localhost')

console.log('API')
console.log(`host ${host}`)
console.log(`port ${port}`)

let baseURL = `${host}:${port}`

export default () => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
