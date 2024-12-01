"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJWTIssuedBeforePasswordChanged = void 0;
const isJWTIssuedBeforePasswordChanged = (passwordChangedTimestamp, jwtIssuedTimestamp) => {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.isJWTIssuedBeforePasswordChanged = isJWTIssuedBeforePasswordChanged;
