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
exports.FlashSaleServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const createFlashSale = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const image = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.image.originalname, file.image.path);
        payload.image = image.secure_url;
    }
    const flashSale = yield prisma_1.default.flashSale.create({ data: payload });
    return flashSale;
});
const getAllFlashSales = () => __awaiter(void 0, void 0, void 0, function* () {
    const flashSales = yield prisma_1.default.flashSale.findMany();
    return flashSales;
});
const getSingleFlashSale = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSale = yield prisma_1.default.flashSale.findUniqueOrThrow({ where: { id } });
});
const deleteFlashSale = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flashSale.findUniqueOrThrow({ where: { id } });
    const flashSale = yield prisma_1.default.flashSale.delete({ where: { id } });
    return flashSale;
});
exports.FlashSaleServices = {
    createFlashSale,
    getAllFlashSales,
    getSingleFlashSale,
    deleteFlashSale,
};
