/**
 * MongoDB Database Configuration
 * Handles connection, monitoring, and health checks
 */

const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

/* =======================================================
   MONGOOSE SETTINGS
======================================================= */

mongoose.set("strictQuery", true);

if (NODE_ENV === "development") {
  mongoose.set("debug", true);
}


/* =======================================================
   CONNECT DATABASE
======================================================= */

async function connectDB() {

  try {

    if (!MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    await mongoose.connect(MONGO_URI, {

      autoIndex: NODE_ENV !== "production",
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000

    });

    logger.info("MongoDB connected successfully");

  } catch (error) {

    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);

  }

}


/* =======================================================
   CONNECTION EVENTS
======================================================= */

mongoose.connection.on("connected", () => {

  logger.info("MongoDB connection established");

});

mongoose.connection.on("error", (err) => {

  logger.error(`MongoDB error: ${err.message}`);

});

mongoose.connection.on("disconnected", () => {

  logger.warn("MongoDB disconnected");

});


/* =======================================================
   HEALTH CHECK
======================================================= */

async function checkDBHealth() {

  try {

    const state = mongoose.connection.readyState;

    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    return {
      status: states[state],
      database: mongoose.connection.name
    };

  } catch (error) {

    return {
      status: "error",
      error: error.message
    };

  }

}


/* =======================================================
   GRACEFUL DISCONNECT
======================================================= */

async function disconnectDB() {

  try {

    await mongoose.connection.close();
    logger.info("MongoDB connection closed");

  } catch (error) {

    logger.error(`Error closing MongoDB connection: ${error.message}`);

  }

}


/* =======================================================
   EXPORTS
======================================================= */

module.exports = connectDB;
module.exports.checkDBHealth = checkDBHealth;
module.exports.disconnectDB = disconnectDB;