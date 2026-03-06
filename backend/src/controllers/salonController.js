const Salon = require("../models/Salon");
const Service = require("../models/Service");

const {
  getNearbySalonsCache,
  setNearbySalonsCache,
  getSalonDetailsCache,
  setSalonDetailsCache,
  clearSalonCache
} = require("../cache/salonCache");

const geoDistance = require("../utils/geoDistance");
const asyncHandler = require("../helpers/asyncHandler");


/**
 * ======================================================
 * CREATE SALON (Owner)
 * ======================================================
 */

exports.createSalon = asyncHandler(async (req, res) => {

  const ownerId = req.user._id;

  const salon = await Salon.create({
    ...req.body,
    ownerId
  });

  res.status(201).json({
    success: true,
    message: "Salon created successfully",
    data: salon
  });

});


/**
 * ======================================================
 * SEARCH SALONS
 * ======================================================
 */

exports.searchSalons = asyncHandler(async (req, res) => {

  const salons = await Salon.find({
    isApproved: true,
    isBlocked: false,
    isDeleted: false
  }).limit(10);

  res.json({
    success: true,
    data: salons
  });

});


/**
 * ======================================================
 * GET NEARBY SALONS
 * ======================================================
 */

exports.getNearbySalons = asyncHandler(async (req, res) => {

  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude required"
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  // Check Redis Cache
  const cachedSalons = await getNearbySalonsCache(latitude, longitude);

  if (cachedSalons) {
    return res.json({
      success: true,
      source: "cache",
      data: cachedSalons
    });
  }

  // Query MongoDB
  const salons = await Salon.find({
    isApproved: true,
    isBlocked: false,
    isDeleted: false
  });

  // Calculate distance
  const salonsWithDistance = salons.map((salon) => {

    const distance = geoDistance(
      latitude,
      longitude,
      salon.location.coordinates[1],
      salon.location.coordinates[0]
    );

    return {
      ...salon.toObject(),
      distance
    };

  });

  salonsWithDistance.sort((a, b) => a.distance - b.distance);

  // Save in Redis
  await setNearbySalonsCache(latitude, longitude, salonsWithDistance);

  res.json({
    success: true,
    source: "database",
    data: salonsWithDistance
  });

});


/**
 * ======================================================
 * GET SALON DETAILS
 * ======================================================
 */

exports.getSalon = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  // Check cache
  const cachedSalon = await getSalonDetailsCache(salonId);

  if (cachedSalon) {
    return res.json({
      success: true,
      source: "cache",
      data: cachedSalon
    });
  }

  // Query database
  const salon = await Salon.findById(salonId)
    .populate("ownerId", "name phone")
    .populate("services");

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: "Salon not found"
    });
  }

  // Increase view count
  salon.analytics.views += 1;
  await salon.save();

  // Cache result
  await setSalonDetailsCache(salonId, salon);

  res.json({
    success: true,
    source: "database",
    data: salon
  });

});


/**
 * ======================================================
 * UPDATE SALON (Owner)
 * ======================================================
 */

exports.updateSalon = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: "Salon not found"
    });
  }

  // Owner authorization
  if (salon.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized"
    });
  }

  Object.assign(salon, req.body);

  await salon.save();

  await clearSalonCache(salonId);

  res.json({
    success: true,
    message: "Salon updated successfully",
    data: salon
  });

});


/**
 * ======================================================
 * DELETE SALON (Soft Delete)
 * ======================================================
 */

exports.deleteSalon = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: "Salon not found"
    });
  }

  salon.isDeleted = true;

  await salon.save();

  await clearSalonCache(salonId);

  res.json({
    success: true,
    message: "Salon deleted successfully"
  });

});


/**
 * ======================================================
 * ADMIN APPROVE SALON
 * ======================================================
 */

exports.approveSalon = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: "Salon not found"
    });
  }

  salon.isApproved = true;

  await salon.save();

  await clearSalonCache(salonId);

  res.json({
    success: true,
    message: "Salon approved successfully"
  });

});


/**
 * ======================================================
 * GET SALON SERVICES
 * ======================================================
 */

exports.getSalonServices = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const services = await Service.find({
    salonId,
    isDeleted: false
  });

  res.json({
    success: true,
    data: services
  });

});