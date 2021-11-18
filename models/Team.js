const mongoose = require('mongoose')
const { Schema } = mongoose
var user=require('./User')
var scheduleID=require('./Schedules')
const schema = new Schema({
    teamName:{type:String,required:true},
    teamCode:{type:String,required:true},
    teamAdmins:[{
        adminID:{type:mongoose.Types.ObjectId,ref:'user'},
        adminFirstName:{type:String},
        adminLastName:{type:String}
    }],
    teamMembers:[{
        memberID:{type:mongoose.Types.ObjectId,ref:'user'},
        memberFirstName:{type:String},
        memberLastName:{type:String}
    }],
    schedules:[{
        scheduleID:{type:mongoose.Types.ObjectId,ref:'Schedule'},
        title:{type:String,required:true},
        desc:{type:String},
        start:{type:Date,required:true},
        end:{type:Date,required:true}
    }]
})
module.exports = mongoose.model('Team', schema)