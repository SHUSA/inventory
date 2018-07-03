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
      res.status(500).send({
        error: 'An error occured fetching entries'
      })
    }
  },

  async show (req, res) {
    try {
      let department = await Entry.findById(req.params.deptId)
      res.send(department)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching Entry'
      })
    }
  },

  async post (req, res) {
    try {
      const department = await Entry.create(req.body)
      res.send(department)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving Entry'
      })
    }
  },

  async put (req, res) {
    try {
      const department = await Entry.update(req.body, {
        where: {
          id: req.params.deptId
        }
      })
      res.send(department)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating Entry'
      })
    }
  }
}
