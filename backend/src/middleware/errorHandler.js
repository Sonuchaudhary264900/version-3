/**
 * Global Error Handler Middleware
 * Handles all errors in the Smart Salon backend
 */

const ERROR_MESSAGES = require("../constants/errorMessages");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {

  /* =======================================================
     LOG ERROR
  ======================================================= */

  logger.error({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack
  });


  /* =======================================================
     DEFAULT ERROR
  ======================================================= */

  let statusCode = err.statusCode || 500;
  let message = err.message || ERROR_MESSAGES.SYSTEM.INTERNAL_SERVER_ERROR;


  /* =======================================================
     MONGODB CAST ERROR (INVALID ID)
  ======================================================= */

  if (err.name === "CastError") {

    statusCode = 400;
    message = "Invalid resource ID";

  }


  /* =======================================================
     DUPLICATE KEY ERROR
  ======================================================= */

  if (err.code === 11000) {

    statusCode = 400;

    const field = Object.keys(err.keyValue)[0];

    message = `Duplicate value for field: ${field}`;

  }


  /* =======================================================
     MONGOOSE VALIDATION ERROR
  ======================================================= */

  if (err.name === "ValidationError") {

    statusCode = 400;

    const errors = Object.values(err.errors).map(
      e => e.message
    );

    message = errors.join(", ");

  }


  /* =======================================================
     JWT ERRORS
  ======================================================= */

  if (err.name === "JsonWebTokenError") {

    statusCode = 401;
    message = ERROR_MESSAGES.AUTH.TOKEN_INVALID;

  }

  if (err.name === "TokenExpiredError") {

    statusCode = 401;
    message = "Authentication token expired";

  }


  /* =======================================================
     RATE LIMIT ERROR
  ======================================================= */

  if (err.status === 429) {

    statusCode = 429;
    message = ERROR_MESSAGES.SYSTEM.TOO_MANY_REQUESTS;

  }


  /* =======================================================
     RESPONSE
  ======================================================= */

  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === "development") {

    response.stack = err.stack;

  }

  res.status(statusCode).json(response);

};

module.exports = errorHandler;