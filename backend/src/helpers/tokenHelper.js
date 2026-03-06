/**
 * Token Helper
 * Handles JWT token generation and verification
 */

const jwt = require("jsonwebtoken");
const env = require("../config/env");
const logger = require("../utils/logger");


/**
 * Generate Access Token
 */
function generateAccessToken(payload) {

  try {

    const token = jwt.sign(

      payload,

      env.auth.JWT_SECRET,

      {
        expiresIn: env.auth.JWT_EXPIRES_IN || "7d"
      }

    );

    return token;

  } catch (error) {

    logger.error(`Token generation error: ${error.message}`);

    throw error;

  }

}


/**
 * Generate Refresh Token
 * (optional future feature)
 */
function generateRefreshToken(payload) {

  try {

    const token = jwt.sign(

      payload,

      env.auth.JWT_SECRET,

      {
        expiresIn: "30d"
      }

    );

    return token;

  } catch (error) {

    logger.error(`Refresh token generation error: ${error.message}`);

    throw error;

  }

}


/**
 * Verify Token
 */
function verifyToken(token) {

  try {

    const decoded = jwt.verify(

      token,

      env.auth.JWT_SECRET

    );

    return decoded;

  } catch (error) {

    logger.error(`Token verification error: ${error.message}`);

    throw error;

  }

}


/**
 * Decode Token (without verification)
 */
function decodeToken(token) {

  try {

    return jwt.decode(token);

  } catch (error) {

    logger.error(`Token decode error: ${error.message}`);

    return null;

  }

}


module.exports = {

  generateAccessToken,

  generateRefreshToken,

  verifyToken,

  decodeToken

};