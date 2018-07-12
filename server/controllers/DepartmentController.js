const { Department } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let departments = await Department.findAll({
        where: {
          active: req.query.status
        },
        order: [
          ['name', 'DESC']
        ]
      })
      res.send(departments)
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error occured fetching departments'
      })
    }
  },

  async show (req, res) {
    try {
      let department = await Department.findById(req.params.deptId)
      res.send(department)
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error occured fetching Department'
      })
    }
  },

  async post (req, res) {
    try {
      const department = await Department.create(req.body)
      res.send(department)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving Department'
      })
    }
  },

  async put (req, res) {
    try {
      const department = await Department.update(req.body, {
        where: {
          id: req.params.deptId
        }
      })
      res.send(department)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating Department'
      })
    }
  }
}
