const { Assay } = require('../models')
// const Issue = require('../models/Issues')

module.exports = {
  async index (req, res) {
    try {
      const search = req.query.search
      let assays = null
      if (search) {
        assays = await Assay.findAll({
          where: {
            $or: ['active'].map(key => ({
              [key]: search
            }))
          },
          order: [
            ['name', 'ASC']
          ]
        })
      } else {
        assays = await Assay.findAll()
      }
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
