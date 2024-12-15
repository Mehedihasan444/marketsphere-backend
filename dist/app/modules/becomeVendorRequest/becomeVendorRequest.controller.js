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
exports.BecomeVendorRequestControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const becomeVendorRequest_service_1 = require("./becomeVendorRequest.service");
const http_status_1 = __importDefault(require("http-status"));
const InsertBecomeVendorRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BecomeVendorRequest = yield becomeVendorRequest_service_1.BecomeVendorRequestServices.InsertBecomeVendorRequest(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Request send Successfully",
        data: BecomeVendorRequest,
    });
}));
const getAllBecomeVendorRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BecomeVendorRequest = yield becomeVendorRequest_service_1.BecomeVendorRequestServices.getAllBecomeVendorRequests();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All request retrieved Successfully",
        data: BecomeVendorRequest,
    });
}));
const getSingleBecomeVendorRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BecomeVendorRequest = yield becomeVendorRequest_service_1.BecomeVendorRequestServices.getSingleBecomeVendorRequest(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Request retrieved Successfully",
        data: BecomeVendorRequest,
    });
}));
const deleteBecomeVendorRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BecomeVendorRequest = yield becomeVendorRequest_service_1.BecomeVendorRequestServices.deleteBecomeVendorRequest(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Request canceled Successfully",
        data: BecomeVendorRequest,
    });
}));
const updateBecomeVendorRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BecomeVendorRequest = yield becomeVendorRequest_service_1.BecomeVendorRequestServices.updateBecomeVendorRequest(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Status updated Successfully",
        data: BecomeVendorRequest,
    });
}));
exports.BecomeVendorRequestControllers = {
    InsertBecomeVendorRequest,
    getAllBecomeVendorRequests,
    getSingleBecomeVendorRequest,
    deleteBecomeVendorRequest,
    updateBecomeVendorRequest,
};
