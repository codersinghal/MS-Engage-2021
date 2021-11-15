const mongoose = require("mongoose");
var teams_sch =require('./Team')
const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  teams:[{type:mongoose.Types.ObjectId,ref:'Team'}],
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);