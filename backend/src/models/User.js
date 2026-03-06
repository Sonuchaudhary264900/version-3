const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  role: {
    type: String,
    enum: ["user", "owner", "admin"],
    default: "user"
  },

  profileImage: {
    type: String
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  dateOfBirth: {
    type: Date
  },

  address: {
    type: String
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },

  favoriteSalons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon"
    }
  ],

  isVerified: {
    type: Boolean,
    default: false
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  lastLogin: {
    type: Date
  },

  loginCount: {
    type: Number,
    default: 0
  },

  deviceTokens: [
    {
      type: String
    }
  ],

  metadata: {
    signupSource: {
      type: String,
      default: "mobile"
    },

    referralCode: {
      type: String
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


/* ================= INDEXES ================= */

/* Email lookup */
userSchema.index({ email: 1 });

/* Role filtering */
userSchema.index({ role: 1 });

/* Geo search */
userSchema.index({ location: "2dsphere" });

/* Soft delete filtering */
userSchema.index({ isDeleted: 1 });


/* ================= METHODS ================= */

userSchema.methods.incrementLogin = function () {

  this.loginCount += 1;
  this.lastLogin = new Date();

  return this.save();

};


/* ================= STATIC METHODS ================= */

userSchema.statics.findActiveUsers = function () {

  return this.find({
    isDeleted: false
  });

};


/* ================= PRE SAVE HOOK ================= */

userSchema.pre("save", function (next) {

  if (!this.phone) {
    return next(new Error("Phone number is required"));
  }

  next();

});


const User = mongoose.model("User", userSchema);

module.exports = User;