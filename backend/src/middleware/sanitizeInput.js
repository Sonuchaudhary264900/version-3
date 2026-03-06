/**
 * Sanitize Input Middleware
 * Protects APIs from XSS and NoSQL injection attacks
 */

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const logger = require("../utils/logger");


/* =======================================================
   RECURSIVE SANITIZER
======================================================= */

const sanitizeObject = (obj, depth = 0) => {

  if (!obj || typeof obj !== "object") return obj;

  /* Prevent extremely deep recursion */
  if (depth > 10) return obj;

  for (const key in obj) {

    /* Prevent prototype pollution */
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      delete obj[key];
      continue;
    }

    const value = obj[key];

    if (typeof value === "string") {

      obj[key] = xss(value.trim());

    }

    else if (Array.isArray(value)) {

      value.forEach((item, index) => {

        if (typeof item === "string") {
          value[index] = xss(item.trim());
        } else if (typeof item === "object") {
          sanitizeObject(item, depth + 1);
        }

      });

    }

    else if (typeof value === "object") {

      sanitizeObject(value, depth + 1);

    }

  }

};


/* =======================================================
   MAIN MIDDLEWARE
======================================================= */

const sanitizeInput = (req, res, next) => {

  try {

    /* ---------- NoSQL Injection Protection ---------- */

    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.query);
    mongoSanitize.sanitize(req.params);


    /* ---------- XSS Protection ---------- */

    sanitizeObject(req.body);
    sanitizeObject(req.query);
    sanitizeObject(req.params);


    next();

  } catch (error) {

    logger.error(`Sanitize middleware error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Input sanitization failed"
    });

  }

};


module.exports = sanitizeInput;