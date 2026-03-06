const User = require("../models/User");
const Salon = require("../models/Salon");
const Booking = require("../models/Booking");
const Review = require("../models/Review");


/* ==================================================
   ADMIN DASHBOARD STATS
================================================== */

exports.getDashboardStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments();

    const totalSalons = await Salon.countDocuments();

    const approvedSalons = await Salon.countDocuments({
      isApproved: true
    });

    const blockedUsers = await User.countDocuments({
      isBlocked: true
    });

    const totalBookings = await Booking.countDocuments();

    const completedBookings = await Booking.countDocuments({
      status: "completed"
    });

    const pendingBookings = await Booking.countDocuments({
      status: "pending"
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled"
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);

    const platformRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSalons,
        approvedSalons,
        blockedUsers,
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        platformRevenue
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ==================================================
   GET TOP SALONS
================================================== */

exports.getTopSalons = async (req, res) => {

  try {

    const salons = await Salon.find({
      isApproved: true,
      isDeleted: false
    })
    .sort({ rating: -1 })
    .limit(10);

    res.json({
      success: true,
      data: salons
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ==================================================
   GET RECENT BOOKINGS
================================================== */

exports.getRecentBookings = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("userId", "name phone")
      .populate("salonId", "name")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ==================================================
   APPROVE SALON
================================================== */

exports.approveSalon = async (req, res) => {

  try {

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

    res.json({
      success: true,
      message: "Salon approved successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ==================================================
   USER MANAGEMENT
================================================== */

exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



exports.blockUser = async (req, res) => {

  try {

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.isBlocked = true;

    await user.save();

    res.json({
      success: true,
      message: "User blocked successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



exports.unblockUser = async (req, res) => {

  try {

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.isBlocked = false;

    await user.save();

    res.json({
      success: true,
      message: "User unblocked successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ==================================================
   SALON MANAGEMENT
================================================== */

exports.getAllSalons = async (req, res) => {

  try {

    const salons = await Salon.find()
      .populate("ownerId", "name phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: salons
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ==================================================
   REVIEW MODERATION
================================================== */

exports.deleteReview = async (req, res) => {

  try {

    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {

      return res.status(404).json({
        success: false,
        message: "Review not found"
      });

    }

    review.isDeleted = true;

    await review.save();

    res.json({
      success: true,
      message: "Review removed"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};