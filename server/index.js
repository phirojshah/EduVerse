const express = require('express')
require('./config/database')
const dotenv = require('dotenv');
const { connect } = require('./config/database');
dotenv.config();

const app = express()
const port = process.env.PORT || 5000
connect();
app.listen(port, () => {
  console.log(`EduVerse Backend listening on port http://localhost:${port}`)
})