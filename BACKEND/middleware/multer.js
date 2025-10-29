const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'reports';
    let resourceType = file.mimetype.startsWith('video') ? 'video' : 'image';

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
