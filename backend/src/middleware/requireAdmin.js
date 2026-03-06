/**
 * Require Admin Middleware
 * Allows only ADMIN users to access protected routes
 */

const ERROR_MESSAGES = require("../constants/errorMessages");
const { ROLES } = require("../constants/roles");
const logger = require("../utils/logger");

const requireAdmin = (req, res, next) => {

  try {

    /* ================= AUTH CHECK ================= */

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.AUTH.UNAUTHORIZED
      });

    }


    /* ================= ROLE CHECK ================= */

    const { role, id } = req.user;

    if (role !== ROLES.ADMIN) {

      logger.warn(`Unauthorized admin route access attempt by user ${id}`);

      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });

    }


    /* ================= ACCESS GRANTED ================= */

    next();

  } catch (error) {

    logger.error(`Admin middleware error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM.INTERNAL_SERVER_ERROR
    });

  }

};

module.exports = requireAdmin;