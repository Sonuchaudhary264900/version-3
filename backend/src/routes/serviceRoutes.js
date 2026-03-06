const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireOwner = require("../middleware/requireOwner");
const { searchLimiter } = require("../middleware/rateLimiter");

const serviceController = require("../controllers/serviceController");


router.use(searchLimiter);


router.get(
  "/search",
  serviceController.searchServices
);

router.get(
  "/popular",
  serviceController.getPopularServices
);

router.get(
  "/salon/:salonId",
  serviceController.getSalonServices
);

router.get(
  "/:serviceId",
  serviceController.getServiceDetails
);


router.post(
  "/",
  requireAuth,
  requireOwner,
  serviceController.createService
);

router.put(
  "/:serviceId",
  requireAuth,
  requireOwner,
  serviceController.updateService
);

router.delete(
  "/:serviceId",
  requireAuth,
  requireOwner,
  serviceController.deleteService
);

router.patch(
  "/:serviceId/toggle",
  requireAuth,
  requireOwner,
  serviceController.toggleServiceStatus
);


module.exports = router;