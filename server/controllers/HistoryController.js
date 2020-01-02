const { History } = require('../models')

module.exports = {
  // show all history of a given ID from a table
  // only execute on request
  async show (req, res) {
    try {
      console.log('start show') 
      const tableName = req.body.tableName
      const rowId = req.body.rowId
      console.log('show history')
      console.log(tableName, rowId)
      res.send(req.params)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async add (req, res) {
    try {
      
    } catch (error) {
      
    }
  }
}
