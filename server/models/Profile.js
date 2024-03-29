const mongoose = require("mongoose");

// Define the profile schema using the Mongoose Schema constructor
const profileSchema = new mongoose.Schema({
  // Define the user field with type String, required, and trimmed
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // Define the bio field with type String, required, and trimmed
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
  // Define the social field with type Object
});

module.exports = mongoose.model("Profile", profileSchema);
