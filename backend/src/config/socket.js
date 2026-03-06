const { Server } = require("socket.io");
const logger = require("../utils/logger");

let io = null;


/* =======================================================
   INITIALIZE SOCKET
======================================================= */

function initSocket(server) {

  io = new Server(server, {

    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"]
    },

    transports: ["websocket"],

    pingTimeout: 60000

  });


  io.on("connection", (socket) => {

    logger.info(`Socket connected: ${socket.id}`);


    /* ---------- USER ROOM ---------- */

    socket.on("joinUserRoom", (userId) => {

      if (!userId) return;

      const room = `user_${userId}`;

      socket.join(room);

      logger.info(`Socket ${socket.id} joined ${room}`);

    });


    /* ---------- SALON ROOM ---------- */

    socket.on("joinSalonRoom", (salonId) => {

      if (!salonId) return;

      const room = `salon_${salonId}`;

      socket.join(room);

      logger.info(`Socket ${socket.id} joined ${room}`);

    });


    /* ---------- DISCONNECT ---------- */

    socket.on("disconnect", () => {

      logger.info(`Socket disconnected: ${socket.id}`);

    });

  });

}


/* =======================================================
   GET SOCKET INSTANCE
======================================================= */

function getIO() {

  if (!io) {

    throw new Error("Socket.io not initialized. Call initSocket first.");

  }

  return io;

}


/* =======================================================
   EMIT USER NOTIFICATION
======================================================= */

function emitNotification(userId, notification) {

  try {

    if (!io || !userId) return;

    io.to(`user_${userId}`).emit("notification", notification);

  } catch (error) {

    logger.error(`Socket emitNotification error: ${error.message}`);

  }

}


/* =======================================================
   EMIT BOOKING EVENT
======================================================= */

function emitBookingCreated(booking) {

  try {

    if (!io || !booking?.salonId) return;

    io.to(`salon_${booking.salonId}`).emit("bookingCreated", booking);

  } catch (error) {

    logger.error(`Socket emitBookingCreated error: ${error.message}`);

  }

}


/* =======================================================
   EXPORTS
======================================================= */

module.exports = {

  initSocket,
  getIO,
  emitNotification,
  emitBookingCreated

};