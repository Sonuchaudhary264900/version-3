const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const { searchLimiter } = require("../middleware/rateLimiter");

const notificationController = require("../controllers/notificationController");


/* ================= RATE LIMITING ================= */

router.use(searchLimiter);


/* ================= USER NOTIFICATIONS ================= */

router.get(
  "/",
  requireAuth,
  notificationController.getUserNotifications
);

router.get(
  "/unread",
  requireAuth,
  notificationController.getUnreadNotifications
);

router.patch(
  "/read-all",
  requireAuth,
  notificationController.markAllNotificationsAsRead
);

router.patch(
  "/:notificationId/read",
  requireAuth,
  notificationController.markNotificationAsRead
);

router.delete(
  "/:notificationId",
  requireAuth,
  notificationController.deleteNotification
);


/* ================= ADMIN NOTIFICATIONS ================= */

router.post(
  "/admin/send",
  requireAuth,
  requireAdmin,
  notificationController.sendNotificationToUser
);

router.post(
  "/admin/broadcast",
  requireAuth,
  requireAdmin,
  notificationController.broadcastNotification
);


module.exports = router;