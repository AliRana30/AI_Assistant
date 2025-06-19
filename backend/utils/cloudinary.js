const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filepath) => {
  const result = await cloudinary.uploader.upload(filepath, {
    folder: "uploads",
  });

  fs.unlinkSync(filepath); // Clean local file
  return result.secure_url;
};

module.exports = uploadToCloudinary;
