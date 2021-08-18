const multer = require('multer');
const UploadMiddleware = require('../middleware/upload');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/images/profile");
  },
  filename: (req, file, cb) => {
    let fileName = Date.now() + "---" + file.originalname;
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