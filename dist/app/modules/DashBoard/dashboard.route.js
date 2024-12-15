"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get('/admin', (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), dashboard_controller_1.DashboardControllers.getAdminDashboardData);
router.get('/vendor', (0, auth_1.default)(client_1.Role.VENDOR), dashboard_controller_1.DashboardControllers.getVendorDashboardData);
router.get('/customer', (0, auth_1.default)(client_1.Role.CUSTOMER), dashboard_controller_1.DashboardControllers.getCustomerDashboardData);
exports.DashboardRoutes = router;
