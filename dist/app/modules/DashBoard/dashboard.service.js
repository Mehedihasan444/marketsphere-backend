"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getAdminDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.adminDashboard.findFirst();
    return result;
});
const getVendorDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.vendorDashboard.findFirst();
    return result;
});
const getCustomerDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.customerDashboard.findFirst();
    return result;
});
exports.DashboardServices = {
    getAdminDashboardData,
    getVendorDashboardData,
    getCustomerDashboardData
};
