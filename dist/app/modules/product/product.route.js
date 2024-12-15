"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
exports.ProductRoutes = router;
// Route to create a new product (only accessible by Vendors or Admins)
router.post("/", (0, auth_1.default)(client_1.Role.VENDOR, client_1.Role.ADMIN), sendImageToCloudinary_1.upload.array("images", 5), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(product_validation_1.productValidationSchema.createProductValidationSchema), product_controller_1.ProductControllers.createProduct);
// Route to get all products (publicly accessible)
router.get("/", product_controller_1.ProductControllers.getAllProducts);
// Route to update a product (only accessible by the Vendor who created it or Admin)
router.put("/:id", (0, auth_1.default)(client_1.Role.VENDOR, client_1.Role.ADMIN), (0, validateRequest_1.default)(product_validation_1.productValidationSchema.updateProductValidationSchema), product_controller_1.ProductControllers.updateProduct);
// Route to get a single product (publicly accessible)
router.get("/:id", product_controller_1.ProductControllers.getSingleProduct);
// Route to delete a product (only accessible by the Vendor who created it or Admin)
router.delete("/:id", (0, auth_1.default)(client_1.Role.VENDOR, client_1.Role.ADMIN), product_controller_1.ProductControllers.deleteProduct);
