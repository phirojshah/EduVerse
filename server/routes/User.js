//Import the required  Models
const express = require("express");
const router = express.Router();

//Import the required Controllers and middlewares
const {
  login,
  signup,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");

//Routes

//Routes for User Login
router.post("/login", login);

//Routes for User Signup
router.post("/signup", signup);

//Routes for sending OTP to the user email
router.post("/sendotp", sendOTP);

//Routes for changing the password
router.post("/changePassword", changePassword);

module.exports = router;
