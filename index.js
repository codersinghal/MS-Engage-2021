require("dotenv").config();
require("./config/database").connect();
cors=require('cors')
const express = require("express")
const path = require('path');
const app = express();
app.use(express.static(path.resolve(__dirname, "client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

app.use(express.json());
app.use(cors())


const port = process.env.PORT || 4001;

app.use(require('./routes/auth'));
app.use(require('./routes/others'));

// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});