"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const shop_controller_1 = require("./shop.controller");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
exports.ShopRoutes = router;
// Route to create a new Shop (only accessible by Vendors)
router.post("/", (0, auth_1.default)(client_1.Role.VENDOR), sendImageToCloudinary_1.upload.fields([
    { name: "logo", maxCount: 1 }, // Handle `logo` file upload
    { name: "banner", maxCount: 1 }, // Handle `banner` file upload
]), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, 
//   validateRequest(shopValidationSchema.createShopValidationSchema),
shop_controller_1.ShopControllers.createShop);
// Route to get all Shops (accessible by Admins and Customers)
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN, client_1.Role.CUSTOMER, client_1.Role.VENDOR), shop_controller_1.ShopControllers.getAllShops);
// Route to update a Shop (only accessible by Vendors)
router.patch("/:id", (0, auth_1.default)(client_1.Role.VENDOR), sendImageToCloudinary_1.upload.fields([
    { name: "logo", maxCount: 1 }, // Handle `logo` file upload
    { name: "banner", maxCount: 1 }, // Handle `banner` file upload
]), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, 
//   validateRequest(shopValidationSchema.updateShopValidationSchema),
shop_controller_1.ShopControllers.updateShop);
router.patch("/:id/status", (0, auth_1.default)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN), shop_controller_1.ShopControllers.updateShopStatus);
// Route to get a single Shop (publicly accessible)
router.get("/:id", shop_controller_1.ShopControllers.getSingleShop);
// Route to delete a Shop (only accessible by Admins)
router.delete("/:id", (0, auth_1.default)(client_1.Role.VENDOR, client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), shop_controller_1.ShopControllers.deleteShop);
