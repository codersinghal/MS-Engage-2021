const mongoose = require('mongoose')
const { Schema } = mongoose
var user=require('./User')
var team_sch=require('./Team')
const schema = new Schema({
  title:{type:String,required:true},
  desc:{type:String,default:null},
  start:{type:Date,required:true},
  end:{type:Date,required:true},
  scheduledInTeam:[{type:mongoose.Types.ObjectId,required:true,ref:'Team'}]
})
module.exports = mongoose.model('Schedule', schema)