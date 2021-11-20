require("dotenv").config();
require("./config/database").connect();
cors=require('cors')
const express = require("express");
const http = require("http");
const path = require('path');
const app = express();
if(process.env.NODE_ENV === "production"){
  app.use(express.static("frontend/build"))
}

app.use(express.json());
app.use(cors())
const server = http.createServer(app);


const port = process.env.PORT || 4001;

app.use(require('./routes/auth'));
app.use(require('./routes/others'));

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});