const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120
  },

  description: {
    type: String,
    maxlength: 1000
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },

  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  address: {
    type: String,
    required: true
  },

  city: {
    type: String
  },

  state: {
    type: String
  },

  country: {
    type: String,
    default: "India"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },

    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: v => v.length === 2,
        message: "Coordinates must contain longitude and latitude"
      }
    }
  },

  coverImage: String,

  gallery: {
    type: [String],
    validate: {
      validator: arr => arr.length <= 20,
      message: "Gallery cannot exceed 20 images"
    }
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  totalBookings: {
    type: Number,
    default: 0
  },

  workingHours: {
    start: {
      type: String,
      default: "09:00",
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },

    end: {
      type: String,
      default: "18:00",
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    }
  },

  slotDuration: {
    type: Number,
    default: 30
  },

  bufferTime: {
    type: Number,
    default: 5
  },

  isOpen: {
    type: Boolean,
    default: true
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  tags: {
    type: [String],
    default: []
  },

  analytics: {
    views: {
      type: Number,
      default: 0
    },

    bookings: {
      type: Number,
      default: 0
    }
  }

},
{
  timestamps: true
});


/* ================= DATABASE INDEXES ================= */

/* Owner lookup */
salonSchema.index({ ownerId: 1 });

/* Geo search for nearby salons */
salonSchema.index({ location: "2dsphere" });

/* Rating sorting */
salonSchema.index({ rating: -1 });

/* Approval filtering */
salonSchema.index({ isApproved: 1 });

/* Soft delete filtering */
salonSchema.index({ isDeleted: 1 });

/* Text search */
salonSchema.index({ name: "text", description: "text" });


/* ================= METHODS ================= */

salonSchema.methods.incrementViews = function () {

  this.analytics.views += 1;
  return this.save();

};

salonSchema.methods.incrementBookings = function () {

  this.totalBookings += 1;
  this.analytics.bookings += 1;

  return this.save();

};


/* ================= STATIC METHODS ================= */

salonSchema.statics.findApproved = function () {

  return this.find({
    isApproved: true,
    isDeleted: false,
    isBlocked: false
  });

};


/* ================= SOFT DELETE FILTER ================= */

salonSchema.pre(/^find/, function(next){

  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }

  next();

});


const Salon = mongoose.model("Salon", salonSchema);

module.exports = Salon;