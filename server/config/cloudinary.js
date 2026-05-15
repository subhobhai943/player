const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'player/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  }),
});

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'player/audio',
    allowed_formats: ['mp3', 'wav', 'm4a', 'ogg'],
    resource_type: 'video',
  }),
});

module.exports = { cloudinary, imageStorage, audioStorage };
