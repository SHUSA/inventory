const { Assay } = require('../models')
// to do: add eager loading? Department
module.exports = {
  async index (req, res) {
    try {
      const attributes = req.query.attributes
      const search = {
        active: req.query.active
      }
      if (!req.user.Department.all) {
        search.DepartmentId = req.user.DepartmentId
      }
      let assays = await Assay.findAll({
        where: search,
        order: [
          ['name', 'ASC']
        ],
        attributes: attributes
      })
      res.send(assays)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async show (req, res) {
    try {
      let assay = await Assay.findById(req.params.assayId)
      res.send(assay)
    } catch (error) {
      res.status(500).send(error.errors)
    }
  },

  async post (req, res) {
    try {
      const assayData = req.body
      assayData.DepartmentId = req.user.DepartmentId

      const assay = await Assay.create(assayData)
      res.send(assay)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async put (req, res) {
    try {
      await Assay.update(req.body, {
        where: {
          id: req.params.assayId
        }
      })
      res.send(req.body)
    } catch (error) {
      res.status(500).send(error.errors)
    }
  }
}
