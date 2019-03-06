const { Vendor } = require('../models')

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
      let vendors = await Vendor.findAll({
        where: search,
        order: [
          ['name', 'ASC']
        ],
        attributes: attributes
      })
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
      const vendorData = req.body
      vendorData.DepartmentId = req.user.DepartmentId

      const vendor = await Vendor.create(vendorData)
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
