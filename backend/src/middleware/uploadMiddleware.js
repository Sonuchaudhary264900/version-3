const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smart-salon/salons",
    allowed_formats: ["jpg", "jpeg", "png"]
  }
});

const upload = multer({ storage });

const uploadMultiple = upload.array("images", 10);
const uploadCover = upload.single("cover");

module.exports = {
  uploadMultiple,
  uploadCover
};