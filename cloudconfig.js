const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'wanderlust_DEV',
            allowedFormats: ['png', 'jpg', 'jpeg'],
            transformation: [
                { width: 300, height: 250, crop: 'fill' }, // Adjust dimensions as needed
                // Add any other transformations you want
            ],
        };
    },
});

module.exports = {
    cloudinary,
    storage,
};
