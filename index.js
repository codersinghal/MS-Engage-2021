require("dotenv").config();
require("./config/database").connect();
cors=require('cors')
const express = require("express")
const path = require('path');
const app = express();


app.use(express.json());
app.use(cors())


const port = process.env.PORT || 4001;

// import routes
app.use(require('./routes/auth'));
app.use(require('./routes/others'));

app.use(express.static(path.resolve(__dirname, "frontend/build")));

// serve index.html on any other req
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "frontend/build", "index.html"));
});

// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});