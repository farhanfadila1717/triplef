const path = require('path');

function checkFileType(file, cb, reg) {
  // Allowed ext
  const filetypes = reg;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(`Error file type: support ${reg} only`);
  }
}

exports.checkFileType = checkFileType;