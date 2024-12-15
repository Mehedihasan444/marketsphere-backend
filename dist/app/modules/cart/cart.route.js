"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const cart_controller_1 = require("./cart.controller");
const router = express_1.default.Router();
exports.CartRoutes = router;
// Route to add a product to the cart (accessible by authenticated users)
router.post("/", (0, auth_1.default)(client_1.Role.CUSTOMER), 
// validateRequest(cartValidationSchema.addCartValidationSchema),
cart_controller_1.CartControllers.addToCart);
// Route to get all items in the cart for the logged-in user (accessible by authenticated users)
router.get("/", (0, auth_1.default)(client_1.Role.CUSTOMER), cart_controller_1.CartControllers.getCartItems);
// Route to clear the cart (accessible by authenticated users)
router.delete("/:id/clear-cart", (0, auth_1.default)(client_1.Role.CUSTOMER), cart_controller_1.CartControllers.clearCart);
// Route to update a cart item (e.g., change quantity, remove item) (accessible by authenticated users)
router.put("/:id", (0, auth_1.default)(client_1.Role.CUSTOMER), 
// validateRequest(cartValidationSchema.updateCartValidationSchema),
cart_controller_1.CartControllers.updateCartItem);
// Route to remove a single product from the cart (accessible by authenticated users)
router.delete("/:id", (0, auth_1.default)(client_1.Role.CUSTOMER), cart_controller_1.CartControllers.removeCartItem);
