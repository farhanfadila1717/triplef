const multer = require('multer');
const UploadMiddleware = require('../middleware/upload');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/document");
  },
  filename: (req, file, cb) => {
    let fileName = Date.now() + "---" + file.originalname;
    cb(null, fileName);
  }
});

const uploadPDF = multer({
  storage: fileStorage, fileFilter: (req, file, cb) => {
    UploadMiddleware.checkFileType(file, cb, /pdf/);
  }
});


module.exports = uploadPDF;