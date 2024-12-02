"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const vendor_controller_1 = require("./vendor.controller");
const router = (0, express_1.Router)();
// Get all vendors
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), vendor_controller_1.VendorControllers.getAllVendors);
// Get a vendor by ID
router.get("/:id", (0, auth_1.default)(client_1.Role.ADMIN), vendor_controller_1.VendorControllers.getSingleVendor);
// Update a vendor by ID
router.put("/:id", (0, auth_1.default)(client_1.Role.ADMIN), vendor_controller_1.VendorControllers.updateVendor);
// Delete a vendor by ID
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN), vendor_controller_1.VendorControllers.deleteVendor);
exports.VendorRoutes = router;
