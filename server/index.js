const express = require("express");
const database = require("./config/database");
const { data } = require("autoprefixer");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
database.connect();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.listen(PORT, () => {
  console.log(`EduVerse Backend listening on port http://localhost:${PORT}`);
});
