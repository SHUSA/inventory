const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VendorSchema = new Schema({
  name: {type: String, unique: [true, 'That vendor already exists']},
  shortName: {type: String},
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }]
})

module.exports = mongoose.model('Vendor', VendorSchema)
