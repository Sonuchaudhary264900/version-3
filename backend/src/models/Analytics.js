/**
 * Analytics Model
 * Stores platform analytics and statistics
 */

const mongoose = require("mongoose");


const analyticsSchema = new mongoose.Schema(

  {

    /**
     * Total platform users
     */
    totalUsers: {
      type: Number,
      default: 0
    },


    /**
     * Total salons registered
     */
    totalSalons: {
      type: Number,
      default: 0
    },


    /**
     * Total services offered
     */
    totalServices: {
      type: Number,
      default: 0
    },


    /**
     * Total bookings
     */
    totalBookings: {
      type: Number,
      default: 0
    },


    /**
     * Completed bookings
     */
    completedBookings: {
      type: Number,
      default: 0
    },


    /**
     * Cancelled bookings
     */
    cancelledBookings: {
      type: Number,
      default: 0
    },


    /**
     * Platform revenue
     */
    totalRevenue: {
      type: Number,
      default: 0
    },


    /**
     * Daily bookings
     */
    dailyBookings: {
      type: Number,
      default: 0
    },


    /**
     * Monthly bookings
     */
    monthlyBookings: {
      type: Number,
      default: 0
    },


    /**
     * Most popular service
     */
    topService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },


    /**
     * Most popular salon
     */
    topSalon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon"
    },


    /**
     * Analytics date
     */
    date: {
      type: Date,
      default: Date.now
    }

  },

  {
    timestamps: true
  }

);


/**
 * Index for analytics queries
 */
analyticsSchema.index({ date: -1 });


module.exports = mongoose.model("Analytics", analyticsSchema);