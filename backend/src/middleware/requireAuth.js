/**
 * Require Auth Middleware
 * Verifies JWT token and authenticates user
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ERROR_MESSAGES = require("../constants/errorMessages");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const requireAuth = async (req, res, next) => {

  try {

    /* ================= TOKEN EXTRACTION ================= */

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.AUTH.UNAUTHORIZED
      });

    }

    const token = authHeader.split(" ")[1];


    /* ================= TOKEN VERIFICATION ================= */

    let decoded;

    try {

      decoded = jwt.verify(token, JWT_SECRET);

    } catch (error) {

      if (error.name === "TokenExpiredError") {

        return res.status(401).json({
          success: false,
          message: "Authentication token expired"
        });

      }

      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.AUTH.TOKEN_INVALID
      });

    }


    /* ================= USER VALIDATION ================= */

    const user = await User.findById(decoded.userId)
      .select("_id role phone isBlocked")
      .lean();

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found"
      });

    }

    if (user.isBlocked) {

      return res.status(403).json({
        success: false,
        message: "Your account has been blocked"
      });

    }


    /* ================= ATTACH USER ================= */

    req.user = {
      id: user._id,
      role: user.role,
      phone: user.phone
    };


    /* ================= CONTINUE ================= */

    next();

  } catch (error) {

    logger.error(`Authentication middleware error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.INTERNAL_SERVER_ERROR
    });

  }

};

module.exports = requireAuth;