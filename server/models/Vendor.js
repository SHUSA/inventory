const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VendorSchema = new Schema({
  name: {type: String, unique: true, required: true},
  shortName: {type: String},
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }],
  active: {type: Boolean, default: true}
})

module.exports = mongoose.model('Vendor', VendorSchema)
