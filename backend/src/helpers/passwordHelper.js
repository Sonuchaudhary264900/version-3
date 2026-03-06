/**
 * Password Helper
 * Handles password hashing and verification
 */

const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

const SALT_ROUNDS = 10;


/**
 * Hash password
 */
async function hashPassword(password) {

  try {

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;

  } catch (error) {

    logger.error(`Password hash error: ${error.message}`);

    throw error;

  }

}


/**
 * Compare password
 */
async function comparePassword(password, hashedPassword) {

  try {

    const match = await bcrypt.compare(password, hashedPassword);

    return match;

  } catch (error) {

    logger.error(`Password compare error: ${error.message}`);

    return false;

  }

}


/**
 * Validate password strength
 */
function validatePasswordStrength(password) {

  if (!password) {
    return {
      valid: false,
      message: "Password is required"
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters"
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber) {

    return {
      valid: false,
      message:
        "Password must contain uppercase, lowercase and number"
    };

  }

  return {
    valid: true
  };

}


module.exports = {

  hashPassword,
  comparePassword,
  validatePasswordStrength

};