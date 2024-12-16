import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import config from '../config';
import path from 'path';


cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName.trim() },
      function (error, result) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('File is deleted.');
          }
        });
      },
    );
  });
};


// Ensure uploads directory exists
const uploadDir = path.join(
  config.NODE_ENV !== "production" ? "/tmp/uploads" : process.cwd(), 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create uploads directory:', error);
  throw error; // Stop execution if directory creation fails
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the uploads directory dynamically if it doesn't exist
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname); // Extract file extension
    const baseName = path.basename(file.originalname, ext); // File name without extension
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({ storage: storage });