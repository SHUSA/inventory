const Assay = require('mongoose').model('Assay')
// const Issue = require('../models/Issues')

module.exports = {
  async index (req, res) {
    try {
      await Assay.find({})
        .populate(['items'])
        .sort({name: -1}, (err, doc) => {
          if (err) {
            console.log(err)
            // planned issue logger
            // Issue.issue(err, 'assay all')
          } else {
            res.send(doc)
          }
        })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching assays'
      })
    }
  },

  async show (req, res) {
    const assay = req.body

    try {
      await Assay.find({_id: assay.id})
        .populate(['items'])
        .exec((err, doc) => {
          if (err) {
            console.log(err)
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
    const assayData = {
      name: assay.name,
      weeklyVolume: assay.weeklyVolume,
      weeklyRuns: assay.weeklyRuns,
      controlsPerRun: assay.controlsPerRun,
      maxBatchSize: assay.maxBatchSize,
      sampleReplicates: assay.sampleReplicates,
      active: true
    }
    const newAssay = new Assay(assayData)

    try {
      await newAssay.save((err) => {
        if (err) {
          console.log(err)
        } else {
          res.send('Saved assay')
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
    const assayData = {
      name: assay.name,
      weeklyVolume: assay.weeklyVolume,
      weeklyRuns: assay.weeklyRuns,
      controlsPerRun: assay.controlsPerRun,
      maxBatchSize: assay.maxBatchSize,
      sampleReplicates: assay.sampleReplicates,
      active: assay.active
    }

    try {
      await Assay.update({_id: req.body.id}, assayData, (err, doc) => {
        if (err) {
          console.log(err)
        } else {
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
