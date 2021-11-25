const mongoose = require('mongoose')
const { Schema } = mongoose
var user=require('./User')
var team_sch=require('./Team')

// Schedule schema for db
const schema = new Schema({
  title:{type:String,required:true},
  desc:{type:String,default:null},
  start:{type:Date,required:true},
  end:{type:Date,required:true},
  specialMention:[{
    memberID:{type:mongoose.Types.ObjectId,ref:'user'},
    memberFirstName:{type:String},
    memberLastName:{type:String}
  }],
  scheduledInTeam:[{type:mongoose.Types.ObjectId,required:true,ref:'Team'}]
})
module.exports = mongoose.model('Schedule', schema)