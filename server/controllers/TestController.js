const express = require('express')
const Test = require('mongoose').model('Test')

module.exports = {
  async index (req, res) {
    const decode = req.body
    console.log(decode)
    Test.all().exec((err, test) => {
      if (err) {
        console.log(err)
      } else {
        console.log(test)
      }
    })
  },

  async put (req, res) {

  },

  async post (req, res) {
    const decode = req.body
    const testData = {
      text: decode.text + 8,
      not: 333
    }
    const newTest = new Test(testData)
    newTest.save((err) => {
      if (err) {
        console.log(err)
      } else {
        res.send('hit')
      }
    })
  }
}
