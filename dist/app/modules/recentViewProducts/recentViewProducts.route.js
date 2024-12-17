"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentViewProductsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const recentViewProducts_controller_1 = require("./recentViewProducts.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.Role.CUSTOMER), recentViewProducts_controller_1.RecentViewProductsControllers.createRecentViewProduct);
router.get('/', (0, auth_1.default)(client_1.Role.CUSTOMER), recentViewProducts_controller_1.RecentViewProductsControllers.getRecentViewProducts);
exports.RecentViewProductsRoutes = router;
