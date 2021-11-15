require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const http = require("http");
const app = express();

app.use(express.json());

const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.use(require('./routes/auth'));
app.use(require('./routes/others'));

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});