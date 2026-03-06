const bookingEmitter = require("./bookingEmitter");
const logger = require("../utils/logger");


/* ===============================
   BOOKING CREATED EVENT
================================ */

bookingEmitter.on("booking.created", async (booking) => {

  try {

    logger.info(`Event received: booking.created ${booking._id}`);

    // future integrations
    // notifications
    // analytics update

  } catch (error) {

    logger.error("Error handling booking.created event", error);

  }

});


/* ===============================
   BOOKING CANCELLED EVENT
================================ */

bookingEmitter.on("booking.cancelled", async (booking) => {

  try {

    logger.info(`Event received: booking.cancelled ${booking._id}`);

  } catch (error) {

    logger.error("Error handling booking.cancelled event", error);

  }

});