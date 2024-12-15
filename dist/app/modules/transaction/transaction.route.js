"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const transaction_controller_1 = require("./transaction.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), transaction_controller_1.transactionController.getAllTransactions);
exports.TransactionRoutes = router;
