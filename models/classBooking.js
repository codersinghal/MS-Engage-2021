const mongoose = require('mongoose')
const { Schema } = mongoose
var user=require('../models/User')
var classid=require('../models/ClassSchedule')
const schema = new Schema({
  classID: { type: mongoose.Types.ObjectId, required: true,ref:classid },
  studentID: { type: mongoose.ObjectId, required: true,ref:user }
})
module.exports = mongoose.model('Booking', schema)