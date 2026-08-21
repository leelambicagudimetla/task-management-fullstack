const { upload } = require("../config/cloudinary");

// Single-file upload for the "attachment" field sent by TaskFormModal's FormData
module.exports = upload.single("attachment");
