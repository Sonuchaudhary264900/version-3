/**
 * Analytics Job
 * Runs scheduled analytics calculations
 */

const cron = require("node-cron");

const Booking = require("../models/Booking");
const Salon = require("../models/Salon");
const Service = require("../models/Service");
const Review = require("../models/Review");
const Analytics = require("../models/Analytics");


/**
 * Calculate salon booking counts
 */
const updateSalonBookingCounts = async () => {

  try {

    const salons = await Salon.find();

    for (const salon of salons) {

      const bookingCount = await Booking.countDocuments({
        salonId: salon._id
      });

      salon.bookingCount = bookingCount;

      await salon.save();

    }

    console.log("Salon booking counts updated");

  } catch (error) {

    console.error("Salon booking count analytics error:", error);

  }

};


/**
 * Calculate service popularity
 */
const updateServicePopularity = async () => {

  try {

    const services = await Service.find();

    for (const service of services) {

      const bookingCount = await Booking.countDocuments({
        serviceId: service._id
      });

      service.bookingCount = bookingCount;

      await service.save();

    }

    console.log("Service popularity updated");

  } catch (error) {

    console.error("Service popularity analytics error:", error);

  }

};


/**
 * Update salon ratings
 */
const updateSalonRatings = async () => {

  try {

    const salons = await Salon.find();

    for (const salon of salons) {

      const reviews = await Review.find({
        salonId: salon._id
      });

      if (reviews.length === 0) {
        salon.rating = 0;
        salon.reviewCount = 0;
      } else {

        const totalRating = reviews.reduce(
          (sum, r) => sum + r.rating,
          0
        );

        salon.rating = totalRating / reviews.length;
        salon.reviewCount = reviews.length;

      }

      await salon.save();

    }

    console.log("Salon ratings updated");

  } catch (error) {

    console.error("Salon rating analytics error:", error);

  }

};


/**
 * Platform analytics summary
 */
const updatePlatformAnalytics = async () => {

  try {

    const totalBookings = await Booking.countDocuments();

    const completedBookings = await Booking.countDocuments({
      status: "completed"
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled"
    });

    const revenue = await Booking.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);

    await Analytics.create({
      totalBookings,
      completedBookings,
      cancelledBookings,
      revenue: revenue[0]?.totalRevenue || 0
    });

    console.log("Platform analytics updated");

  } catch (error) {

    console.error("Platform analytics error:", error);

  }

};


/**
 * Main analytics job
 */
const startAnalyticsJob = () => {

  /**
   * Runs every night at 2 AM
   */
  cron.schedule("0 2 * * *", async () => {

    console.log("Running analytics job...");

    await updateSalonBookingCounts();

    await updateServicePopularity();

    await updateSalonRatings();

    await updatePlatformAnalytics();

    console.log("Analytics job completed");

  });

};


module.exports = startAnalyticsJob;