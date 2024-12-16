"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const wishlist_controller_1 = require("./wishlist.controller");
const router = express_1.default.Router();
// Route to add a product to the wishlist (accessible by authenticated users)
router.post("/", (0, auth_1.default)(client_1.Role.CUSTOMER), wishlist_controller_1.WishlistControllers.addToWishlist);
// Route to get all items in the wishlist for the logged-in user (accessible by authenticated users)
router.get("/", (0, auth_1.default)(client_1.Role.CUSTOMER), wishlist_controller_1.WishlistControllers.getWishlistItems);
// Route to clear the wishlist (accessible by authenticated users)
router.delete("/:id/clear-wishlist", (0, auth_1.default)(client_1.Role.CUSTOMER), wishlist_controller_1.WishlistControllers.clearWishlist);
// Route to remove a single product from the wishlist (accessible by authenticated users)
router.delete("/:id", (0, auth_1.default)(client_1.Role.CUSTOMER), wishlist_controller_1.WishlistControllers.removeWishlistItem);
exports.WishlistRoutes = router;
