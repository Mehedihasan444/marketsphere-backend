"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.success,
        statusCode: data === null || data === void 0 ? void 0 : data.statusCode,
        message: Array.isArray(data.data) && data.data.length === 0 ? "No data found." : data.message,
        data: data.data,
        // Array.isArray(data.data) && data.data.length === 0 ? "Database is empty" : data.data,
        token: data.token
    });
};
exports.default = sendResponse;
