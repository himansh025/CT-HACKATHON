  const multer = require("multer"); // Remove destructuring - multer is default export

  // Configure storage for multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
      // console.log(this.filename)
    }
  });

  // Create the multer instance with the defined storage
  const upload = multer({
    storage: storage,
  });

  // Export the `upload` instance
  module.exports = { upload };