const jwt = require("jsonwebtoken");
const User = require("../models/User");

const otpService = require("../services/otpService");
const smsService = require("../services/smsService");

const asyncHandler = require("../utils/asyncHandler");
const ERROR_MESSAGES = require("../constants/errorMessages");


/* ================= TOKEN GENERATOR ================= */

const generateToken = (userId) => {

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d"
    }
  );

};


/* ================= SEND OTP ================= */

exports.sendOTP = asyncHandler(async (req, res) => {

  const { phone } = req.body;

  if (!phone || !/^[0-9]{10}$/.test(phone)) {

    return res.status(400).json({
      success: false,
      message: "Valid phone number required"
    });

  }

  let otp;

  try {

    otp = otpService.createOTP(phone);

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

  /* Send OTP */

  await smsService.sendOTP(phone, otp);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully"
  });

});


/* ================= VERIFY OTP ================= */

exports.verifyOTP = asyncHandler(async (req, res) => {

  const { phone, otp } = req.body;

  if (!phone || !otp) {

    return res.status(400).json({
      success: false,
      message: "Phone and OTP are required"
    });

  }

  try {

    otpService.verifyOTP(phone, otp);

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }


  /* Find user */

  let user = await User.findOne({ phone });


  /* Create user if first login */

  if (!user) {

    user = await User.create({
      phone,
      role: "user",
      isVerified: true
    });

  }


  /* Block check */

  if (user.isBlocked) {

    return res.status(403).json({
      success: false,
      message: ERROR_MESSAGES.USER.ACCOUNT_BLOCKED
    });

  }


  /* Update login analytics */

  user.loginCount += 1;
  user.lastLogin = new Date();

  await user.save();


  /* Generate token */

  const token = generateToken(user._id);


  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      phone: user.phone,
      role: user.role
    }
  });

});


/* ================= GET CURRENT USER ================= */

exports.getMe = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {

    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.USER.USER_NOT_FOUND
    });

  }

  res.status(200).json({
    success: true,
    user
  });

});


/* ================= LOGOUT ================= */

exports.logout = asyncHandler(async (req, res) => {

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });

});