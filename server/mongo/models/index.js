const path = require('path')
const fs = require('fs')
const Mongoose = require('mongoose')
const config = require('../config/config')
const db = {}

fs.readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  ).forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

module.exports.connect = (uri) => {
  Mongoose.connect(uri);
  // plug in the promise library:
  Mongoose.Promise = global.Promise;


  Mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
    process.exit(1);
  });

  // load models
  require("./Home");
  require("./Bill");
  require("./Roommate");
};

module.exports = db
