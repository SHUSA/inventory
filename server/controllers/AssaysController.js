const { Assay } = require('../models')
// const Issue = require('../models/Issues')

module.exports = {
  async index (req, res) {
    try {
      let assays = await Assay.findAll({
        where: {
          active: req.query.status
        },
        order: [
          ['name', 'DESC']
        ]
      })
      res.send(assays)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  async show (req, res) {
    try {
      let assay = await Assay.findById(req.params.assayId)
      res.send(assay)
    } catch (error) {
      res.status(500).send(error)
    }
  },

  async post (req, res) {
    try {
      const assay = await Assay.create(req.body)
      res.send(assay)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
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
      res.status(500).send(error)
    }
  }
}
