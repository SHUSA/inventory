import axios from 'axios'

// env taken from webpack
const port = process.env.SERVER_PORT || 8081
const host = 'http://' + (process.env.HOST || 'localhost')

console.log('api.js')
console.log(`server port ${port}`)
console.log(`regular port ${process.env.PORT}`)

let baseURL = `${host}:${port}`

export default () => {
  return axios.create({
    baseURL: baseURL
  })
}
