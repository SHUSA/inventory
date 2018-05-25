const express = require('express')
const Test = require('mongoose').model('Test')

module.exports = {
  async index (req, res) {
    const decode = decodeURIComponent(req.body)
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
    const decode = decodeURIComponent(req.body)
    console.log(decode)
  }
}
