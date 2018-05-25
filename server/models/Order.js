const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  items: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  time: {type: Date}
})

module.exports = mongoose.model('Order', OrderSchema)
