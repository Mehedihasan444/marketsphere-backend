"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const errorSources = [];
    if (err.code === 'P2002') {
        // Unique constraint failed
        const meta = err.meta;
        meta.target.forEach((field) => {
            errorSources.push({
                path: field,
                message: `${field} must be unique`,
            });
        });
    }
    else {
        // Other Prisma validation errors
        errorSources.push({
            path: 'unknown',
            message: err.message,
        });
    }
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};
exports.default = handleValidationError;
