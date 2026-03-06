/**
 * Generate Slots Utility
 * Generates available booking slots for salons
 */

const Booking = require("../models/Booking");
const { BOOKING_CONFIG } = require("./constants");


/**
 * Convert HH:MM to minutes
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};


/**
 * Convert minutes to HH:MM
 */
const minutesToTime = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};


/**
 * Generate time slots based on working hours
 */
const generateTimeSlots = (
  startTime,
  endTime,
  slotDuration = BOOKING_CONFIG.DEFAULT_SLOT_DURATION
) => {

  const slots = [];

  let start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  while (start + slotDuration <= end) {

    const slotStart = minutesToTime(start);
    const slotEnd = minutesToTime(start + slotDuration);

    slots.push({
      startTime: slotStart,
      endTime: slotEnd
    });

    start += slotDuration;

  }

  return slots;

};



/**
 * Get booked slots for a salon
 */
const getBookedSlots = async (salonId, date) => {

  const bookings = await Booking.find({
    salonId,
    date,
    status: { $in: ["pending", "confirmed"] }
  });

  return bookings.map(b => b.startTime);

};



/**
 * Filter available slots
 */
const filterAvailableSlots = (slots, bookedSlots) => {

  return slots.filter(slot => !bookedSlots.includes(slot.startTime));

};



/**
 * Generate available booking slots
 */
const generateAvailableSlots = async (
  salonId,
  date,
  workingHours
) => {

  const { startTime, endTime } = workingHours;

  /**
   * Generate all possible slots
   */
  const allSlots = generateTimeSlots(startTime, endTime);

  /**
   * Get booked slots
   */
  const bookedSlots = await getBookedSlots(salonId, date);

  /**
   * Filter available slots
   */
  const availableSlots = filterAvailableSlots(allSlots, bookedSlots);

  return {
    totalSlots: allSlots.length,
    bookedSlots: bookedSlots.length,
    availableSlots
  };

};



/**
 * Check if specific slot is available
 */
const isSlotAvailable = async (salonId, date, startTime) => {

  const booking = await Booking.findOne({
    salonId,
    date,
    startTime,
    status: { $in: ["pending", "confirmed"] }
  });

  return !booking;

};



/**
 * Generate slots for multiple days
 */
const generateSlotsForDays = async (
  salonId,
  workingHours,
  days = 7
) => {

  const results = [];

  for (let i = 0; i < days; i++) {

    const date = new Date();
    date.setDate(date.getDate() + i);

    const formattedDate = date.toISOString().split("T")[0];

    const slots = await generateAvailableSlots(
      salonId,
      formattedDate,
      workingHours
    );

    results.push({
      date: formattedDate,
      ...slots
    });

  }

  return results;

};



module.exports = {
  generateTimeSlots,
  generateAvailableSlots,
  isSlotAvailable,
  generateSlotsForDays
};