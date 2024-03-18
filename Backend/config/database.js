const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Database is connected successfully"))
    .catch((error) => {
      console.log("Database connection issues");
      console.error(error);
      process.exit(1);
    });
};
