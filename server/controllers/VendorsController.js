const { Vendor } = require('../models')
const { Item } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching vendors'
      })
    }
  },

  async show (req, res) {
    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching vendor'
      })
    }
  },

  async post (req, res) {
    const vendor = req.body
    const vendorData = {}
    for (let key in vendor) {
      vendorData[key] = vendor[key]
    }
    const newVendor = new Vendor(vendorData)

    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving vendor'
      })
    }
  },

  async put (req, res) {
    const vendor = req.body.params.vendor
    const vendorName = req.body.params.origName
    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating vendor'
      })
    }
  }
}
