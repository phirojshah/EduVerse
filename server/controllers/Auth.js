const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Send otp
exports.sendOTP = async (req, res) => {
  try {
    //Fetch email from request body
    const { email } = req.body;

    //check if user is already exist or not
    const checkUserPresent = await User.findOne({ email });

    //if user exist then, return the response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //Otp generator
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated: ", otp);

    //Check otp is unique or not --bekar code
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };

    //create entry at DB
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return  response
    res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Signup
exports.signup = async (req, res) => {
  try {
    //Destructure from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //check if all the fields are present or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "Please fill all the details",
      });
    }

    //check password and confirm password is matched or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are not matched",
      });
    }

    //check if user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please Sign in to continue",
      });
    }

    //find the most recent otp for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(response);

    if (response.length === 0) {
      //otp no find for the email
      return res.status(400).json({
        success: false,
        message: "Otp is not valid",
      });
    } else if (otp !== response[0].otp) {
      //Invalid otp
      return res.status(400).json({
        success: false,
        message: "OTP is not valid",
      });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // create additional profile for the user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
    });

    res.status(200).json({
      success: true,
      user,
      message: "User registered Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    //get email and password from request body
    const { email, password } = req.body;

    //check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }
    //check user exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      //Return unauthorized status
      return res.status(401).json({
        success: false,
        message: "User is not registered with us. Please Signup to Continue",
      });
    }
    // compare password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      //save the token to the database
      user.token = token;
      user.password = undefined;

      //set cookie for the token and return response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User Logged in Succefully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);

    //return 500 Internal  Server error
    return res.status(500).json({
      success: false,
      message: "Login Failure. Please try again",
    });
  }
};

//Change password
