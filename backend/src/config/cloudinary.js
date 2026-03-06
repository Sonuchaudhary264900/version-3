const cloudinary = require("cloudinary").v2;
const logger = require("../utils/logger");

/* Validate environment variables */

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  logger.error("Cloudinary environment variables are missing");
  throw new Error("Cloudinary configuration error");
}


/* Configure Cloudinary */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


module.exports = cloudinary;