const Service = require("../models/Service");
const Salon = require("../models/Salon");

const asyncHandler = require("../helpers/asyncHandler");
const ERROR_MESSAGES = require("../constants/errorMessages");


exports.createService = asyncHandler(async (req, res) => {

  const { salonId } = req.body;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  const service = await Service.create({
    salonId,
    name: req.body.name,
    price: req.body.price,
    duration: req.body.duration,
    description: req.body.description
  });

  res.json({
    success: true,
    message: "Service created successfully",
    service
  });

});


exports.updateService = asyncHandler(async (req, res) => {

  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND
    });
  }

  Object.assign(service, req.body);

  await service.save();

  res.json({
    success: true,
    message: "Service updated successfully",
    service
  });

});


exports.deleteService = asyncHandler(async (req, res) => {

  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND
    });
  }

  await service.deleteOne();

  res.json({
    success: true,
    message: "Service deleted successfully"
  });

});


exports.getSalonServices = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const services = await Service.find({ salonId });

  res.json({
    success: true,
    services
  });

});


exports.getServiceDetails = asyncHandler(async (req, res) => {

  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND
    });
  }

  res.json({
    success: true,
    service
  });

});


exports.searchServices = asyncHandler(async (req, res) => {

  const { query } = req.query;

  const services = await Service.find({
    name: { $regex: query || "", $options: "i" }
  });

  res.json({
    success: true,
    services
  });

});


exports.getPopularServices = asyncHandler(async (req, res) => {

  const services = await Service.find()
    .sort({ bookingCount: -1 })
    .limit(10);

  res.json({
    success: true,
    services
  });

});


exports.toggleServiceStatus = asyncHandler(async (req, res) => {

  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND
    });
  }

  service.isActive = !service.isActive;

  await service.save();

  res.json({
    success: true,
    message: "Service status updated",
    service
  });

});