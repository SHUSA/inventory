const { Assay } = require('../models')
const { Item } = require('../models')
// const Issue = require('../models/Issues')

module.exports = {
  async index (req, res) {
    try {
      
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error occured fetching assays'
      })
    }
  },

  async show (req, res) {
    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching assay'
      })
    }
  },

  async post (req, res) {
    const assay = req.body
    const assayData = {}
    for (let key in assay) {
      assayData[key] = assay[key]
    }
    const newAssay = new Assay(assayData)

    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving assay'
      })
    }
  },

  async put (req, res) {
    const assay = req.body.params.assay
    const assayName = req.body.params.origName
    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating assay'
      })
    }
  }
}
