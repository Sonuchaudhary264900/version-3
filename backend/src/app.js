/**
 * Main Express Application
 * Smart Salon Backend
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const crypto = require("crypto");
const path = require("path");

/* Middleware */
const { searchLimiter } = require("./middleware/rateLimiter");
const sanitizeInput = require("./middleware/sanitizeInput");
const errorHandler = require("./middleware/errorHandler");

/* Logger */
const logger = require("./utils/logger");

/* Routes */
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const salonRoutes = require("./routes/salonRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

/* Swagger */
const setupSwagger = require("./docs/swagger");

/* Event Handlers */
require("./events/eventHandlers");

const app = express();

/* =======================================================
   SERVER SETTINGS
======================================================= */

app.set("trust proxy", 1);


/* =======================================================
   SECURITY
======================================================= */

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


/* =======================================================
   PERFORMANCE
======================================================= */

app.use(compression());


/* =======================================================
   BODY PARSER
======================================================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


/* =======================================================
   REQUEST ID (TRACEABILITY)
======================================================= */

app.use((req, res, next) => {

  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-ID", req.requestId);

  next();

});


/* =======================================================
   LOGGING
======================================================= */

if (process.env.NODE_ENV === "development") {

  app.use(morgan("dev"));

} else {

  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

}

app.use((req, res, next) => {

  logger.info({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  next();

});


/* =======================================================
   RATE LIMITER
======================================================= */

app.use(searchLimiter);


/* =======================================================
   INPUT SANITIZATION
======================================================= */

app.use(sanitizeInput);


/* =======================================================
   HEALTH CHECK
======================================================= */

app.get("/health", (req, res) => {

  res.status(200).json({
    status: "ok",
    service: "Smart Salon API",
    uptime: process.uptime(),
    timestamp: new Date(),
  });

});


/* =======================================================
   API VERSION
======================================================= */

const API_VERSION = "/api/v1";


/* =======================================================
   API ROUTES
======================================================= */

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/owners`, ownerRoutes);
app.use(`${API_VERSION}/salons`, salonRoutes);
app.use(`${API_VERSION}/services`, serviceRoutes);
app.use(`${API_VERSION}/bookings`, bookingRoutes);
app.use(`${API_VERSION}/reviews`, reviewRoutes);
app.use(`${API_VERSION}/analytics`, analyticsRoutes);
app.use(`${API_VERSION}/admin`, adminRoutes);
app.use(`${API_VERSION}/notifications`, notificationRoutes);


/* =======================================================
   SWAGGER API DOCS
======================================================= */

setupSwagger(app);


/* =======================================================
   STATIC FILES
======================================================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


/* =======================================================
   404 HANDLER
======================================================= */

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });

});


/* =======================================================
   GLOBAL ERROR HANDLER
======================================================= */

app.use(errorHandler);


/* =======================================================
   EXPORT APP
======================================================= */

module.exports = app;