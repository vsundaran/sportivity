const multer = require('multer');

// memory storage — we’ll send file buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
