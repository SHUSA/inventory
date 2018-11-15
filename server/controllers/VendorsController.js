const { Vendor } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const search = req.query.search
      const attributes = req.query.attributes
      let vendors = null
      if (search) {
        vendors = await Vendor.findAll({
          where: {
            $or: ['active'].map(key => ({
              [key]: search
            }))
          },
          order: [
            ['name', 'ASC']
          ],
          attributes: attributes
        })
      } else {
        vendors = await Vendor.findAll()
      }
      res.send(vendors)
    } catch (error) {
      res.status(500).send(error.errors)
    }
  },

  async show (req, res) {
    try {
      let vendor = await Vendor.findById(req.params.vendorId)
      res.send(vendor)
    } catch (error) {
      res.status(500).send(error.errors)
    }
  },

  async post (req, res) {
    try {
      const vendor = await Vendor.create(req.body)
      res.send(vendor)
    } catch (error) {
      res.status(500).send(error.errors)
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
      res.status(500).send(error.errors)
    }
  }
}
