const mongoose = require("mongoose");

// Define the section schema using the Mongoose Schema constructor
const sectionSchema = new mongoose.Schema({
  sectionName: { type: String },
  subSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Section", sectionSchema);
``;
