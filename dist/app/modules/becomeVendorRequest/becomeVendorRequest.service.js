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
exports.BecomeVendorRequestServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const InsertBecomeVendorRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.becomeVendorRequest.findFirst({
        where: {
            email: payload.email,
            status: client_1.BecomeVendorRequestStatus.PENDING,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already send a request!");
    }
    const becomeVendorRequest = yield prisma_1.default.becomeVendorRequest.create({
        data: Object.assign({}, payload),
    });
    return becomeVendorRequest;
});
const getAllBecomeVendorRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const becomeVendorRequests = yield prisma_1.default.becomeVendorRequest.findMany();
    return becomeVendorRequests;
});
const getSingleBecomeVendorRequest = (BecomeVendorRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    const becomeVendorRequest = yield prisma_1.default.becomeVendorRequest.findFirstOrThrow({
        where: {
            id: BecomeVendorRequestId,
        },
    });
    return becomeVendorRequest;
});
const deleteBecomeVendorRequest = (BecomeVendorRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.becomeVendorRequest.findFirstOrThrow({
        where: {
            id: BecomeVendorRequestId,
        },
    });
    const becomeVendorRequest = yield prisma_1.default.becomeVendorRequest.delete({
        where: {
            id: BecomeVendorRequestId,
        },
    });
    return becomeVendorRequest;
});
const updateBecomeVendorRequest = (BecomeVendorRequestId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const becomeVendorRequest = yield prisma_1.default.becomeVendorRequest.findFirstOrThrow({
        where: {
            id: BecomeVendorRequestId,
        },
    });
    if (payload.status === client_1.BecomeVendorRequestStatus.REJECTED) {
        yield prisma_1.default.becomeVendorRequest.update({
            where: {
                id: BecomeVendorRequestId,
            },
            data: payload,
        });
    }
    else if (payload.status === client_1.BecomeVendorRequestStatus.APPROVED) {
        yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedBecomeVendorRequest = yield transactionClient.becomeVendorRequest.update({
                where: {
                    id: BecomeVendorRequestId,
                },
                data: payload,
            });
            // Update the user's role to VENDOR
            const user = yield transactionClient.user.update({
                where: {
                    email: becomeVendorRequest.email,
                },
                data: {
                    role: client_1.Role.VENDOR,
                },
            });
            // Delete the customer record for this user
            yield transactionClient.customer.delete({
                where: {
                    email: user.email,
                },
            });
            // Create a new vendor record for this user
            yield transactionClient.vendor.create({
                data: {
                    name: user.name,
                    email: user.email,
                },
            });
            // Return the updated request data
            return updatedBecomeVendorRequest;
        }));
    }
    return becomeVendorRequest;
});
exports.BecomeVendorRequestServices = {
    InsertBecomeVendorRequest,
    getAllBecomeVendorRequests,
    getSingleBecomeVendorRequest,
    deleteBecomeVendorRequest,
    updateBecomeVendorRequest,
};
