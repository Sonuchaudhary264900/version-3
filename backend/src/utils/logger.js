const { createLogger, format, transports } = require("winston");
const path = require("path");

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    logFormat
  ),
  transports: [

    new transports.Console(),

    new transports.File({
      filename: path.join(__dirname, "../logs/app.log"),
      level: "info"
    }),

    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error"
    })

  ]
});

module.exports = logger;