"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.UserSearchableFields = exports.USER_STATUS = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    ADMIN: "ADMIN",
    USER: "USER",
};
exports.USER_STATUS = {
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED",
};
exports.UserSearchableFields = [
    "name",
    "email",
    "phone",
    "role",
    "status",
];
exports.userFilterableFields = [
    'email',
    'role',
    'status',
    'searchTerm'
]; // for all filtering 
