const mongoose = require("mongoose");
var cron_job=require('../cron_job/cron_job')

const mongo = process.env.MONGO_URI || 'mongodb+srv://user:qwertyuiop@cluster0.eynnl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to database");
      cron_job.cron_job();
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};