const mongoose = require("mongoose");

// Define the ratingAndReview schema using the Mongoose Schema constructor
const ratingAndReviewSchema = new mongoose.Schema({
  // Define the user field with type String, required, and trimmed
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
