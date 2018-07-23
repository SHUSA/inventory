const { Vendor } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let vendors = await Vendor.findAll({
        where: {
          active: req.query.status
        },
        order: [
          ['name', 'DESC']
        ]
      })
      res.send(vendors)
    } catch (error) {
      res.status(500).send(error)
    }
  },

  async show (req, res) {
    try {
      let vendor = await Vendor.findById(req.params.vendorId)
      res.send(vendor)
    } catch (error) {
      res.status(500).send(error)
    }
  },

  async post (req, res) {
    try {
      const vendor = await Vendor.create(req.body)
      res.send(vendor)
    } catch (error) {
      res.status(500).send(error)
    }
  },

  async put (req, res) {
    try {
      await Vendor.update(req.body, {
        where: {
          id: req.params.vendorId
        }
      })
      res.send(req.body)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
