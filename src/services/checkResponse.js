export default (err) => {
  if (!err.response) {
    err.status = 500
    err.statusText = 'Unable to connect to server. Try again later or contact the administrator/support for assistance.'
    return JSON.parse(JSON.stringify(err))
  } else {
    return JSON.parse(JSON.stringify(err)).response
  }
}
