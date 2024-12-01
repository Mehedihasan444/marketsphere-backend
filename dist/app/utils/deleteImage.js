"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_config_1 = require("../config/cloudinary.config");
const deleteImageFromCloudinary = (files) => {
    const publicIds = [];
    for (const file of Object.values(files)) {
        for (const image of file) {
            publicIds.push(image.filename);
        }
    }
    return new Promise((resolve, reject) => {
        cloudinary_config_1.cloudinaryUpload.api.delete_resources(publicIds, { resource_type: 'image' }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
