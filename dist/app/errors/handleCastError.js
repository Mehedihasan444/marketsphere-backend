"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const errorSources = [];
    if (err.code === 'P2023') {
        // Invalid ID error
        errorSources.push({
            path: 'id',
            message: 'Invalid ID',
        });
    }
    else {
        // Other Prisma errors
        errorSources.push({
            path: 'unknown',
            message: err.message,
        });
    }
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID',
        errorSources,
    };
};
exports.default = handleCastError;
