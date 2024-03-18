const express = require("express");
// const { require } = require("module"); // Add this line
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

//adding middlewares
app.use(express.json());

//connect to db
const db = require("./config/database");
db.connect();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
