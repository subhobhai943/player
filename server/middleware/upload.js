const multer = require('multer');
const { imageStorage, audioStorage } = require('../config/cloudinary');

const uploadCover = multer({ storage: imageStorage });
const uploadAudio = multer({ storage: audioStorage });
const uploadSongAssets = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

module.exports = { uploadCover, uploadAudio, uploadSongAssets };
