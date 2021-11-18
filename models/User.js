const mongoose = require("mongoose");
var teams_sch =require('./Team')
const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  teams:[{
    teamID:{type:mongoose.Types.ObjectId,ref:'Team'},
    teamName:{type:String}
  }],
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);