"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = require("express");
const customer_controller_1 = require("./customer.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get all customers
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), customer_controller_1.CustomerControllers.getAllCustomers);
// Get a customer by ID
router.get("/:id", customer_controller_1.CustomerControllers.getSingleCustomer);
// Update a customer by ID
router.put("/:id", customer_controller_1.CustomerControllers.updateCustomer);
// Delete a customer by ID
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN), customer_controller_1.CustomerControllers.deleteCustomer);
exports.CustomerRoutes = router;
