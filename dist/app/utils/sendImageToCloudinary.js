"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config"));
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, { public_id: imageName.trim() }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            // delete a file asynchronously
            fs_1.default.unlink(path, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('File is deleted.');
                }
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + '/uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });
// Ensure uploads directory exists
const uploadDir = path_1.default.join(config_1.default.NODE_ENV !== "production" ? "/tmp/uploads" : process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // Create the uploads directory dynamically if it doesn't exist
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname); // Extract file extension
        const baseName = path_1.default.basename(file.originalname, ext); // File name without extension
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
