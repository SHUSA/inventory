const {Test} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let test = null

      test = await Test.findAll()
      console.log(test)
      res.send(test)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching'
      })
    }
  },

  async put (req, res) {
    try {
      const test = await Test.update(req.body, {
        where: {
          id: 1
        }
      })
      res.send(req.body)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating'
      })
    }
  },

  async post (req, res) {
    try {
      const test = await Test.create(req.body)
      res.send(test)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured creating'
      })
    }
  }
}
