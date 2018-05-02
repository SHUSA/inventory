const {Test} = require('../models')

module.exports = {
  async index (res, req) {
    try {
      let test = null

      test = await Test.findAll()
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching'
      })
    }
  },

  async put (res, req) {
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

  async post (res, req) {
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
