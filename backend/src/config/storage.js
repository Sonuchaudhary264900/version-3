/**
 * Storage Configuration
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const env = require("./env");
const logger = require("../utils/logger");


/* Upload directories */

const baseUploadPath = path.join(__dirname, "../uploads");

const salonUploadPath = path.join(baseUploadPath, "salons");
const serviceUploadPath = path.join(baseUploadPath, "services");


/* Ensure upload folders exist */

function ensureUploadDirectories() {

  const folders = [salonUploadPath, serviceUploadPath];

  folders.forEach((folder) => {

    if (!fs.existsSync(folder)) {

      fs.mkdirSync(folder, { recursive: true });

      logger.info(`Upload folder created: ${folder}`);

    }

  });

}

ensureUploadDirectories();


/* File type validation */

function fileFilter(req, file, cb) {

  const allowedTypes = /jpeg|jpg|png|webp/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  }

  cb(new Error("Only JPEG, JPG, PNG, WEBP images are allowed"));

}


/* Generate unique filename */

function generateFileName(file) {

  const uniqueSuffix =
    Date.now() + "-" + Math.round(Math.random() * 1e9);

  const extension = path.extname(file.originalname);

  return uniqueSuffix + extension;

}


/* Multer storage */

const salonStorage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, salonUploadPath),

  filename: (req, file, cb) => cb(null, generateFileName(file))

});


const serviceStorage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, serviceUploadPath),

  filename: (req, file, cb) => cb(null, generateFileName(file))

});


/* Multer upload configs */

const uploadSalonImages = multer({

  storage: salonStorage,

  fileFilter,

  limits: { fileSize: env.uploads.MAX_FILE_SIZE }

});


const uploadServiceImages = multer({

  storage: serviceStorage,

  fileFilter,

  limits: { fileSize: env.uploads.MAX_FILE_SIZE }

});


/* Delete image */

async function deleteImage(filePath) {

  try {

    if (fs.existsSync(filePath)) {

      await fs.promises.unlink(filePath);

      logger.info(`Image deleted: ${filePath}`);

    }

  } catch (error) {

    logger.error(`Image delete error: ${error.message}`);

  }

}


/* Get public image URL */

function getImageURL(fileName, folder = "salons") {

  return `/uploads/${folder}/${fileName}`;

}


/* Validate multiple uploads */

function validateImageCount(files, max = 10) {

  if (!files || files.length === 0) {
    throw new Error("No images uploaded");
  }

  if (files.length > max) {
    throw new Error(`Maximum ${max} images allowed`);
  }

}


module.exports = {

  uploadSalonImages,
  uploadServiceImages,

  deleteImage,
  getImageURL,
  validateImageCount

};