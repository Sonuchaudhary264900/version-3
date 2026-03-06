/**
 * Booking Queue
 * Handles high concurrency booking requests using Redis
 */

const { createClient } = require("redis");
const Booking = require("../models/Booking");
const { BOOKING_STATUS } = require("../constants/bookingStatus");


const redisClient = createClient({
  url: process.env.REDIS_URL
});


redisClient.connect().catch(console.error);


/**
 * Queue key generator
 */
const getQueueKey = (salonId, date, startTime) => {
  return `booking_queue:${salonId}:${date}:${startTime}`;
};


/**
 * Add booking request to queue
 */
const enqueueBooking = async (bookingData) => {

  const { salonId, date, startTime } = bookingData;

  const queueKey = getQueueKey(salonId, date, startTime);

  await redisClient.rPush(queueKey, JSON.stringify(bookingData));

  return queueKey;

};


/**
 * Process queue for a slot
 */
const processQueue = async (queueKey) => {

  try {

    const bookingDataString = await redisClient.lPop(queueKey);

    if (!bookingDataString) return;

    const bookingData = JSON.parse(bookingDataString);


    /**
     * Check if slot already booked
     */
    const existingBooking = await Booking.findOne({
      salonId: bookingData.salonId,
      date: bookingData.date,
      startTime: bookingData.startTime,
      status: {
        $in: [
          BOOKING_STATUS.PENDING,
          BOOKING_STATUS.CONFIRMED
        ]
      }
    });


    if (existingBooking) {

      console.log("Slot already booked");

      return;

    }


    /**
     * Create booking
     */
    const booking = new Booking({
      ...bookingData,
      status: BOOKING_STATUS.PENDING
    });

    await booking.save();

    console.log("Booking created:", booking._id);

  } catch (error) {

    console.error("Booking queue error:", error);

  }

};


/**
 * Worker that processes queues
 */
const startBookingQueueWorker = async () => {

  setInterval(async () => {

    try {

      const keys = await redisClient.keys("booking_queue:*");

      for (const key of keys) {

        await processQueue(key);

      }

    } catch (error) {

      console.error("Queue worker error:", error);

    }

  }, 2000); // runs every 2 seconds

};


module.exports = {
  enqueueBooking,
  startBookingQueueWorker
};