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

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

Object.values(uploadDirectories).forEach((directory) => {
  fs.mkdirSync(directory, {
    recursive: true
  });
});

const uploadToCloudinary = async (buffer, file, uploadType) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `harvesthub/${uploadType}`;

  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const form = new FormData();
  form.append(
    'file',
    new Blob([buffer], { type: file.mimetype }),
    file.originalname
  );
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: form
    }
  );

  const result = await response.json();

  if (!response.ok || !result.public_id) {
    throw new Error(
      result.error?.message || 'Image upload to persistent storage failed'
    );
  }

  return result.public_id;
};

const cloudinaryStorage = {
  _handleFile(req, file, callback) {
    const chunks = [];

    file.stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    file.stream.once('error', callback);

    file.stream.once('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const publicId = await uploadToCloudinary(
          buffer,
          file,
          req.uploadType || 'products'
        );

        callback(null, {
          path: `uploads/cloudinary/${publicId}`,
          filename: publicId,
          size: buffer.length
        });
      } catch (error) {
        callback(error);
      }
    });
  },

  _removeFile(req, file, callback) {
    // Cloudinary files are retained if a later request step fails.
    // Cleanup can be handled separately without risking a shared asset.
    callback(null);
  }
};

const diskStorage = multer.diskStorage({
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

  if (
    process.env.NODE_ENV === 'production' &&
    !cloudinaryConfigured
  ) {
    return callback(
      new Error(
        'Persistent image storage is not configured. Add the Cloudinary environment variables.'
      )
    );
  }

  callback(null, true);
};

const uploader = multer({
  storage: cloudinaryConfigured ? cloudinaryStorage : diskStorage,
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
export const imageUpload = uploader;
