const express = require("express");
const database = require("./config/database");
const userRoutes = require("./routes/User");

require("dotenv").config();
const PORT = process.env.PORT || 4000;
database.connect();

const app = express();
app.use(express.json());

app.use("/api/v1/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.listen(PORT, () => {
  console.log(`EduVerse Backend listening on port http://localhost:${PORT}`);
});
