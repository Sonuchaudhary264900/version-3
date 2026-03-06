const EventEmitter = require("events");

class BookingEmitter extends EventEmitter {}

const bookingEmitter = new BookingEmitter();

module.exports = bookingEmitter;