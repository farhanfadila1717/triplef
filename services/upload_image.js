const multer = require('multer');
const UploadMiddleware = require('../middleware/upload');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profile");
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let fileName = Date.now() + "---profile-pic." + extension;
    cb(null, fileName);
  }
});

const uploadProfilePic = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    UploadMiddleware.checkFileType(file, cb, /jpeg|jpg|png|gif/);
  }
});


module.exports = uploadProfilePic;