const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { Department } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let departments = await Department.findAll({
        where: {
          active: req.query.active,
          [Op.not]: {
            all: true
          }
        },
        attributes: {
          include: req.query.attributes,
          exclude: 'all'
        },
        order: [
          ['name', 'ASC']
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
      if (!req.user.Role.isSuperAdmin) {
        return res.status(403).send({
          error: 'Access denied'
        })
      }
      const department = await Department.update(req.body.params, {
        where: {
          id: req.body.params.id
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
