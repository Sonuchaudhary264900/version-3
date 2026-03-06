const cron = require("node-cron");
const Booking = require("../models/Booking");

const EXPIRATION_MINUTES = 15;

function startBookingExpirationJob() {

  cron.schedule("*/1 * * * *", async () => {

    try {

      const expirationTime = new Date(
        Date.now() - EXPIRATION_MINUTES * 60 * 1000
      );

      const result = await Booking.updateMany(
        {
          status: "pending",
          createdAt: { $lte: expirationTime }
        },
        {
          $set: { status: "expired" }
        }
      );

      if (result.modifiedCount > 0) {

        console.log(
          `Expired ${result.modifiedCount} pending bookings`
        );

      }

    } catch (error) {

      console.error("Booking expiration job error:", error);

    }

  });

}

module.exports = startBookingExpirationJob;