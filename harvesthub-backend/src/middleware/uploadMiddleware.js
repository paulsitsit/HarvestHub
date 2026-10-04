import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const uploadDirectories = {
  products: 'uploads/products',
  profiles: 'uploads/profiles',
  ids: 'uploads/ids',
  payments: 'uploads/payments'
};

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp'
]);

Object.values(uploadDirectories).forEach((directory) => {
  fs.mkdirSync(directory, {
    recursive: true
  });
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadType = req.uploadType || 'products';

    const directory =
      uploadDirectories[uploadType] || uploadDirectories.products;

    callback(null, directory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${Date.now()}-${crypto
      .randomBytes(8)
      .toString('hex')}${extension}`;

    callback(null, filename);
  }
});

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return callback(
      new Error('Only JPG, PNG, and WEBP images are allowed')
    );
  }

  callback(null, true);
};

const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});

export const setUploadType = (type) => {
  return (req, res, next) => {
    req.uploadType = type;
    next();
  };
};

export const profileUpload = uploader.fields([
  {
    name: 'profilePhoto',
    maxCount: 1
  },
  {
    name: 'farmPhotos',
    maxCount: 5
  },
  {
    name: 'validIdImage',
    maxCount: 1
  }
]);

export const productUpload = uploader.array('images', 5);