const multer = require('multer');
const UploadMiddleware = require('../middleware/upload');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/document");
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let fileName = Date.now() + "---posting_share_doc." + extension;
    cb(null, fileName);
  }
});

const uploadPDF = multer({
  storage: fileStorage, fileFilter: (req, file, cb) => {
    UploadMiddleware.checkFileType(file, cb, /pdf/);
  }
});


module.exports = uploadPDF;