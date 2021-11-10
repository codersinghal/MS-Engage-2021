const mongoose = require('mongoose')
const { Schema } = mongoose
var user=require('../models/User')
const schema = new Schema({
  classTitle: { type: String, required: true },
  classDesc: { type: String, required: true },
  teacher: {type: mongoose.Types.ObjectId, required:true,ref:user},
  classDate: { type: Date, required: true },
  startTime: {type: Number, required:true},
  endTime: {type: Number, required:true},
  venue: {type: String,required:true},
  capacity: {type: Number, required:true},
  vaccineDose1: {type: Boolean, default:false},
  vaccineDose2: {type: Boolean, default:false},
  covidReport: {type: Boolean, default:false},
})
module.exports = mongoose.model('Schedule', schema)