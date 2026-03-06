const { getIO } = require("../config/socket");

function emitBookingCreated(booking) {

  const io = getIO();

  const room = `salon_${booking.salonId}`;

  io.to(room).emit("bookingCreated", {
    booking
  });

}

module.exports = {
  emitBookingCreated
};