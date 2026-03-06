const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
{
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },

  description: {
    type: String,
    maxlength: 500
  },

  category: {
    type: String,
    enum: [
      "haircut",
      "beard",
      "facial",
      "hair-color",
      "spa",
      "massage",
      "grooming",
      "other"
    ],
    default: "other"
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  duration: {
    type: Number,
    required: true
  },

  bufferTime: {
    type: Number,
    default: 5
  },

  image: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true
  },

  popularityScore: {
    type: Number,
    default: 0
  },

  totalBookings: {
    type: Number,
    default: 0
  },

  tags: {
    type: [String],
    default: []
  },

  metadata: {
    recommended: {
      type: Boolean,
      default: false
    }
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
});


/* ================= DATABASE INDEXES ================= */

/* Salon services lookup */
serviceSchema.index({ salonId: 1 });

/* Category filtering */
serviceSchema.index({ category: 1 });

/* Popular services sorting */
serviceSchema.index({ popularityScore: -1 });

/* Active services lookup */
serviceSchema.index({ salonId: 1, isActive: 1 });

/* Soft delete filter */
serviceSchema.index({ isDeleted: 1 });


/* ================= METHODS ================= */

serviceSchema.methods.incrementBooking = function () {

  this.totalBookings += 1;
  this.popularityScore += 1;

  return this.save();

};


/* ================= STATIC METHODS ================= */

serviceSchema.statics.findSalonServices = function (salonId) {

  return this.find({
    salonId,
    isActive: true,
    isDeleted: false
  }).sort({ popularityScore: -1 });

};


const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;