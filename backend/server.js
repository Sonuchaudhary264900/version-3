/**
 * Server Entry Point
 * Starts the Smart Salon backend server
 */

require("dotenv").config();

const http = require("http");

const app = require("./src/app");

const connectDB = require("./src/config/db");
const connectRedis = require("./src/config/redis");

const { initSocket } = require("./src/config/socket");

const startBookingExpirationJob = require("./src/jobs/bookingExpirationJob");
const startAnalyticsJob = require("./src/jobs/analyticsJob");
const startNotificationJob = require("./src/jobs/notificationJob");

const logger = require("./src/utils/logger");


/* ================= SERVER CONFIG ================= */

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";


/* ================= CREATE HTTP SERVER ================= */

const server = http.createServer(app);


/* ================= INITIALIZE SOCKET ================= */

initSocket(server);


/* ================= START SERVER ================= */

const startServer = async () => {

  try {

    logger.info("Starting Smart Salon backend...");
    logger.info(`Environment: ${NODE_ENV}`);


    /* ---------- Connect MongoDB ---------- */

    await connectDB();
    logger.info("MongoDB connected");


    /* ---------- Connect Redis (optional) ---------- */

    try {

      await connectRedis();
      logger.info("Redis connected");

    } catch (redisError) {

      logger.warn("Redis unavailable. Continuing without Redis.");

    }


    /* ---------- Start Background Jobs ---------- */

    startBookingExpirationJob();
    startAnalyticsJob();
    startNotificationJob();

    logger.info("Background jobs started");


    /* ---------- Start HTTP Server ---------- */

    server.listen(PORT, () => {

      logger.info(`🚀 Smart Salon API running on port ${PORT}`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);

    });

  } catch (error) {

    logger.error("Server startup failed:", error);
    process.exit(1);

  }

};


/* ================= GLOBAL ERROR HANDLING ================= */


/* Unhandled Promise Rejection */

process.on("unhandledRejection", (err) => {

  logger.error("Unhandled Promise Rejection:", err);

  server.close(() => {
    process.exit(1);
  });

});


/* Uncaught Exception */

process.on("uncaughtException", (err) => {

  logger.error("Uncaught Exception:", err);

  process.exit(1);

});


/* Graceful Shutdown */

process.on("SIGTERM", () => {

  logger.warn("SIGTERM received. Shutting down gracefully...");

  server.close(() => {

    logger.info("HTTP server closed");
    process.exit(0);

  });

});


/* ================= START APPLICATION ================= */

startServer();