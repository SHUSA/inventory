const { Entry } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let entries = await Entry.findAll({
        where: {
          active: req.query.status
        },
        order: [
          ['name', 'DESC']
        ]
      })
      res.send(entries)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async show (req, res) {
    try {
      let entry = await Entry.findById(req.params.entryId)
      res.send(entry)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async post (req, res) {
    try {
      const entry = await Entry.create(req.body)
      res.send(entry)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async put (req, res) {
    try {
      await Entry.update(req.body, {
        where: {
          id: req.body.id
        }
      })
      res.send(req.body)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async delete (req, res) {
    try {
      let entry = await Entry.destroy({
        where: {
          id: req.params.entryId
        }
      })
      res.send(entry)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  }
}
