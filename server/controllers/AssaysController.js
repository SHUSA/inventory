const { Assay } = require('../models')
// to do: add eager loading? Department
module.exports = {
  async index (req, res) {
    try {
      const active = req.query.active
      const attributes = req.query.attributes
      let assays = await Assay.findAll({
        where: {
          active: active
        },
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
      const assay = await Assay.create(req.body)
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
