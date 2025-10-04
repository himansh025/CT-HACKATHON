const cloudinary = require("cloudinary").v2;
const fs = require('fs');
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadOnCloudinary = async (localFilePath) => {
  console.log("cloud_name", process.env.CLOUDINARY_CLOUD_NAME)
  console.log("cloud_key", process.env.CLOUDINARY_API_KEY)
  console.log("secret", process.env.CLOUDINARY_API_SECRET)

  try {
    if (!localFilePath) {
      console.log('No file path provided.');
      return null;
    }
console.log(localFilePath)
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Automatically detect file type (video, image, etc.)
    });

    console.log('File is uploaded on Cloudinary:', response.url);

    fs.unlinkSync(localFilePath); 

    return response; 
  } catch (error) {
  
    if (localFilePath) {
      try {
        fs.unlinkSync(localFilePath); 
        console.log('Local file deleted due to upload failure.');
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

