"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.UserSearchableFields = exports.USER_STATUS = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    VENDOR: "VENDOR",
};
exports.USER_STATUS = {
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED",
};
exports.UserSearchableFields = ["email"];
exports.userFilterableFields = [
    "email",
    "role",
    "status",
    "searchTerm",
]; // for all filtering
