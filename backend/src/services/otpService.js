/**
 * OTP Service
 * Handles OTP generation, verification and expiration
 */

const crypto = require("crypto");

const otpStore = new Map();

/* ================= CONFIG ================= */

const OTP_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const RESEND_INTERVAL = 60 * 1000; // 1 minute


/* ================= GENERATE OTP ================= */

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};


/* ================= CREATE OTP ================= */

const createOTP = (phone) => {

  const now = Date.now();
  const existing = otpStore.get(phone);

  /* Prevent OTP spam */

  if (existing && now - existing.createdAt < RESEND_INTERVAL) {
    throw new Error("Please wait before requesting another OTP");
  }

  const otp = generateOTP();

  otpStore.set(phone, {
    otp,
    createdAt: now
  });

  return otp;
};


/* ================= VERIFY OTP ================= */

const verifyOTP = (phone, otp) => {

  const record = otpStore.get(phone);

  if (!record) {
    throw new Error("OTP not found");
  }

  /* Check expiration */

  if (Date.now() - record.createdAt > OTP_EXPIRATION) {
    otpStore.delete(phone);
    throw new Error("OTP expired");
  }

  /* Check OTP */

  if (record.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  otpStore.delete(phone);

  return true;
};


/* ================= UTILITIES ================= */

const hasOTP = (phone) => {
  return otpStore.has(phone);
};

const clearOTP = (phone) => {
  otpStore.delete(phone);
};


module.exports = {
  generateOTP,
  createOTP,
  verifyOTP,
  hasOTP,
  clearOTP
};