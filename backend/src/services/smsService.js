/**
 * SMS Service
 * Handles sending SMS notifications
 */

const axios = require("axios");
const logger = require("../utils/logger");


/**
 * SMS configuration
 * These should be stored in .env
 */
const SMS_PROVIDER = process.env.SMS_PROVIDER || "console";
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;
const SMS_API_URL = process.env.SMS_API_URL;



/**
 * Send SMS
 */
const sendSMS = async (phone, message) => {

  try {

    /**
     * Development mode
     * Print SMS to console
     */
    if (SMS_PROVIDER === "console") {

      logger.info(`SMS to ${phone}: ${message}`);

      return {
        success: true,
        message: "SMS logged in console (dev mode)"
      };

    }


    /**
     * Production mode
     * Send SMS via provider API
     */
    const response = await axios.post(
      SMS_API_URL,
      {
        sender: SMS_SENDER_ID,
        route: "4",
        country: "91",
        sms: [
          {
            message,
            to: [phone]
          }
        ]
      },
      {
        headers: {
          authorization: SMS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      success: true,
      data: response.data
    };

  } catch (error) {

    logger.error("SMS sending failed", error.message);

    return {
      success: false,
      error: error.message
    };

  }

};



/**
 * Send OTP SMS
 */
const sendOTP = async (phone, otp) => {

  const message = `Your OTP Verification Code is ${otp}.
Do not share it with anyone.
-- Smart Salon`;

  return sendSMS(phone, message);

};



/**
 * Send booking confirmation SMS
 */
const sendBookingConfirmationSMS = async (phone, salonName, date, time) => {

  const message = `Your appointment at ${salonName} is confirmed on ${date} at ${time}.
Thank you for booking with Smart Salon.`;

  return sendSMS(phone, message);

};



/**
 * Send booking cancellation SMS
 */
const sendBookingCancellationSMS = async (phone, salonName) => {

  const message = `Your booking at ${salonName} has been cancelled.
Please contact the salon for assistance.`;

  return sendSMS(phone, message);

};



/**
 * Send booking reminder SMS
 */
const sendBookingReminderSMS = async (phone, salonName, time) => {

  const message = `Reminder: Your appointment at ${salonName} is at ${time}.
Please arrive on time.`;

  return sendSMS(phone, message);

};



/**
 * Send promotional SMS
 */
const sendPromotionSMS = async (phone, message) => {

  return sendSMS(phone, message);

};



module.exports = {
  sendSMS,
  sendOTP,
  sendBookingConfirmationSMS,
  sendBookingCancellationSMS,
  sendBookingReminderSMS,
  sendPromotionSMS
};