/**
 * OTP Helper
 * Handles OTP generation, storage and verification
 */

const crypto = require("crypto");
const { getRedisClient } = require("../config/redis");
const env = require("../config/env");
const logger = require("../utils/logger");


/**
 * Generate OTP
 * Default: 6 digit numeric OTP
 */
function generateOTP(length = 6) {

  const digits = "0123456789";

  let otp = "";

  for (let i = 0; i < length; i++) {

    otp += digits[Math.floor(Math.random() * digits.length)];

  }

  return otp;

}


/**
 * Redis key generator
 */
function otpKey(phone) {

  return `otp:${phone}`;

}


/**
 * Store OTP in Redis
 */
async function storeOTP(phone, otp) {

  try {

    const redis = getRedisClient();

    const key = otpKey(phone);

    await redis.setEx(

      key,

      env.auth.OTP_EXPIRY || 300,

      otp

    );

    logger.info(`OTP stored for ${phone}`);

  } catch (error) {

    logger.error(`OTP store error: ${error.message}`);

    throw error;

  }

}


/**
 * Verify OTP
 */
async function verifyOTP(phone, otp) {

  try {

    const redis = getRedisClient();

    const key = otpKey(phone);

    const storedOTP = await redis.get(key);

    if (!storedOTP) {

      return false;

    }

    if (storedOTP !== otp) {

      return false;

    }

    /* Delete OTP after successful verification */

    await redis.del(key);

    return true;

  } catch (error) {

    logger.error(`OTP verification error: ${error.message}`);

    return false;

  }

}


/**
 * Clear OTP manually
 */
async function clearOTP(phone) {

  try {

    const redis = getRedisClient();

    const key = otpKey(phone);

    await redis.del(key);

  } catch (error) {

    logger.error(`OTP clear error: ${error.message}`);

  }

}


module.exports = {

  generateOTP,
  storeOTP,
  verifyOTP,
  clearOTP

};