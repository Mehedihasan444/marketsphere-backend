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
exports.FlashSaleControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const flashSale_service_1 = require("./flashSale.service");
const createFlashSale = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const file = req.file;
    const flashSale = yield flashSale_service_1.FlashSaleServices.createFlashSale(file, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FlashSale created Successfully",
        data: flashSale,
    });
}));
const getAllFlashSales = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSale = yield flashSale_service_1.FlashSaleServices.getAllFlashSales();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FlashSales retrieved Successfully",
        data: flashSale,
    });
}));
const getSingleFlashSale = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const flashSale = yield flashSale_service_1.FlashSaleServices.getSingleFlashSale(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FlashSale retrieved Successfully",
        data: flashSale,
    });
}));
const deleteFlashSale = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const flashSale = yield flashSale_service_1.FlashSaleServices.deleteFlashSale(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "FlashSale deleted Successfully",
        data: flashSale,
    });
}));
exports.FlashSaleControllers = {
    createFlashSale,
    getAllFlashSales,
    getSingleFlashSale,
    deleteFlashSale
};
