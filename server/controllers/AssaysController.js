const Assay = require('mongoose').model('Assay')
// const Issue = require('../models/Issues')

module.exports = {
  async index (req, res) {
    try {
      await Assay.find({active: req.query.status})
        .sort({name: -1})
        .exec((err, doc) => {
          if (err) {
            console.log(err)
            res.send(err.message)
          } else {
            res.send(doc)
          }
        })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error occured fetching assays'
      })
    }
  },

  async show (req, res) {
    try {
      await Assay.find({_id: req.params.assayId})
        .exec((err, doc) => {
          if (err) {
            console.log(err)
            res.send(err.message)
          } else {
            res.send(doc)
          }
        })
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
      await newAssay.save((err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          res.send(doc)
          // res.redirect(where?)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving assay'
      })
    }
  },

  async put (req, res) {
    const assay = req.body
    const assayData = {}
    for (let key in assay) {
      assayData[key] = assay[key]
    }

    try {
      await Assay.update({_id: req.params.assayId}, assayData, (err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          console.log(assayData)
          res.send(doc)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating assay'
      })
    }
  }
}
