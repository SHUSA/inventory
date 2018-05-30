const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AssaySchema = new Schema({
  name: {type: String, unique: true, required: true},
  weeklyVolume: {type: Number, default: 0},
  weeklyRuns: {type: Number, default: 0},
  controlsPerRun: {type: Number, default: 0},
  maxBatchSize: {type: Number, default: 0},
  sampleReplicates: {type: Number, default: 0},
  items: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  active: {type: Boolean, default: true}
})

module.exports = mongoose.model('Assay', AssaySchema)
