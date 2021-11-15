const mongoose = require('mongoose')
const { Schema } = mongoose
var user=require('./User')
var scheduleID=require('./Schedules')
const schema = new Schema({
    teamName:{type:String,required:true},
    teamCode:{type:String,required:true},
    teamAdmins:[{type:mongoose.Types.ObjectId,ref:'user'}],
    teamMembers:[{type:mongoose.Types.ObjectId,ref:'user'}],
    schedules:[{type:mongoose.Types.ObjectId,ref:'Schedule'}]
})
module.exports = mongoose.model('Team', schema)