"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
// Get all customers
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), admin_controller_1.AdminControllers.getAllAdmins);
// Get a Admin by ID
router.get("/:id", admin_controller_1.AdminControllers.getSingleAdmin);
// Update a Admin by ID
router.put("/:id", admin_controller_1.AdminControllers.updateAdmin);
// Delete a Admin by ID
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN), admin_controller_1.AdminControllers.deleteAdmin);
exports.AdminRoutes = router;
