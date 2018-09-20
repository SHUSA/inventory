import axios from 'axios'

// env taken from webpack
const port = process.env.PORT || 8081
const host = process.env.HOST || 'http://localhost'

let baseURL = `${host}:${port}`

console.log('axios')
console.log(`NODE_ENV ${process.env.NODE_ENV}`)
console.log(`PORT ${process.env.PORT}`)
console.log(`HOST ${process.env.HOST}`)
console.log(baseURL)

export default () => {
  return axios.create({
    baseURL: baseURL
  })
}
