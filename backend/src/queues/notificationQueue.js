/**
 * Notification Queue
 * Handles asynchronous notification processing
 */

const { createClient } = require("redis");
const Notification = require("../models/Notification");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

const QUEUE_KEY = "notification_queue";


/**
 * Add notification to queue
 */
const enqueueNotification = async (notificationData) => {

  try {

    await redisClient.rPush(
      QUEUE_KEY,
      JSON.stringify(notificationData)
    );

  } catch (error) {

    console.error("Notification enqueue error:", error);

  }

};


/**
 * Process queued notification
 */
const processNotification = async () => {

  try {

    const notificationDataString =
      await redisClient.lPop(QUEUE_KEY);

    if (!notificationDataString) return;

    const notificationData =
      JSON.parse(notificationDataString);


    /**
     * Store notification in database
     */
    const notification = new Notification(notificationData);

    await notification.save();


    /**
     * Here you could trigger external systems
     * like SMS / Email / Push notifications
     */

    console.log(
      "Notification processed:",
      notification._id
    );

  } catch (error) {

    console.error("Notification processing error:", error);

  }

};


/**
 * Worker that processes notification queue
 */
const startNotificationQueueWorker = () => {

  setInterval(async () => {

    try {

      await processNotification();

    } catch (error) {

      console.error("Notification queue worker error:", error);

    }

  }, 1000); // every second

};


module.exports = {
  enqueueNotification,
  startNotificationQueueWorker
};