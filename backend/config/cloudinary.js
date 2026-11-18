const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (file, folder) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Cloudinary returned no upload result"));
            }
            return resolve(result);
        }
    );
    stream.end(file.buffer);
});

module.exports = { cloudinary, uploadToCloudinary };
