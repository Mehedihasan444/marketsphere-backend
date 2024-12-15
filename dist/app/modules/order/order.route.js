"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_validation_1 = require("./order.validation");
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
exports.OrderRoutes = router;
// Route to create a new order (only accessible by Customers)
router.post("/", (0, auth_1.default)(client_1.Role.CUSTOMER), 
// validateRequest(orderValidationSchema.createOrderValidationSchema),
order_controller_1.OrderControllers.createOrder);
// Route to get all orders (only accessible by Admins)
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN, client_1.Role.CUSTOMER, client_1.Role.VENDOR), order_controller_1.OrderControllers.getAllOrders);
// Route to update an order (only accessible by Admins)
router.put("/:id", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN, client_1.Role.CUSTOMER, client_1.Role.VENDOR), (0, validateRequest_1.default)(order_validation_1.orderValidationSchema.updateOrderValidationSchema), order_controller_1.OrderControllers.updateOrder);
// Route to get a single order (only accessible by the Customer who created it or Admin)
router.get("/:id", (0, auth_1.default)(client_1.Role.CUSTOMER, client_1.Role.ADMIN), order_controller_1.OrderControllers.getSingleOrder);
// Route to delete an order (only accessible by Admins)
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN), order_controller_1.OrderControllers.deleteOrder);
