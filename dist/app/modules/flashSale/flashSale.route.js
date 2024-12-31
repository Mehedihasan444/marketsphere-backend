"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const flashSale_controller_1 = require("./flashSale.controller");
const flashSale_validation_1 = require("./flashSale.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.VENDOR), sendImageToCloudinary_1.upload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(flashSale_validation_1.FlashSaleValidationSchema.createFlashSaleValidationSchema), flashSale_controller_1.FlashSaleControllers.createFlashSale);
router.post("/add-product", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN, client_1.Role.VENDOR), flashSale_controller_1.FlashSaleControllers.addProductToFlashSale);
router.get("/", flashSale_controller_1.FlashSaleControllers.getAllFlashSales);
router.put("/:id", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.VENDOR), (0, validateRequest_1.default)(flashSale_validation_1.FlashSaleValidationSchema.updateFlashSaleValidationSchema), flashSale_controller_1.FlashSaleControllers.getSingleFlashSale);
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.VENDOR), flashSale_controller_1.FlashSaleControllers.deleteFlashSale);
exports.FlashSaleRoutes = router;
