const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");


// Cloudinary configuration

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Multer configuration

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


// Upload buffer to Cloudinary

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "expense-tracker"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
};

module.exports = {
    cloudinary,
    upload,
    uploadToCloudinary
};