const multer = require('multer');
const { ApiError } = require('../utils/ApiError');

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_TYPES.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
});

const uploadSingle = (fieldName = 'image') => upload.single(fieldName);
const uploadMultiple = (fieldName = 'images', maxCount = 10) => upload.array(fieldName, maxCount);
const uploadFields = (fields) => upload.fields(fields);

module.exports = { upload, uploadSingle, uploadMultiple, uploadFields };
