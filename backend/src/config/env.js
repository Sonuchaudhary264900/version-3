/**
 * Environment Configuration
 */

require("dotenv").config();

const logger = require("../utils/logger");

const REQUIRED_ENV_VARS = [
  "MONGO_URI",
  "JWT_SECRET"
];


/* Validate required environment variables */

function validateEnv() {

  const missing = [];

  REQUIRED_ENV_VARS.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {

    logger.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );

    process.exit(1);

  }

}

validateEnv();


/* Environment configuration */

const env = {

  server: {

    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: Number(process.env.PORT) || 5000,

  },

  database: {

    MONGO_URI: process.env.MONGO_URI,

  },

  auth: {

    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

    OTP_EXPIRY: Number(process.env.OTP_EXPIRY) || 300

  },

  redis: {

    REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379"

  },

  rateLimit: {

    WINDOW_MINUTES: Number(process.env.RATE_LIMIT_WINDOW) || 15,

    MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX) || 100

  },

  uploads: {

    MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,

    UPLOAD_PATH: process.env.UPLOAD_PATH || "src/uploads"

  },

  analytics: {

    INTERVAL: process.env.ANALYTICS_INTERVAL || "0 * * * *"

  },

  socket: {

    PORT: Number(process.env.SOCKET_PORT) || 5001

  }

};

module.exports = env;