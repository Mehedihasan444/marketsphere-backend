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
exports.paymentService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const payment_utils_1 = require("./payment.utils");
const makePayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, amount } = paymentData;
    // **
    // orderId
    // amount
    // **
    const transactionId = (0, payment_utils_1.generateTransactionId)();
    yield prisma_1.default.order.findFirstOrThrow({
        where: {
            id: orderId
        }
    });
    paymentData.transactionId = transactionId;
    yield prisma_1.default.transaction.create({
        data: paymentData
    });
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
const paymentConfirmation = (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactionId, orderId, }) {
    let payment;
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const payment = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = yield tx.transaction.update({
                where: { orderId },
                data: {
                    status: client_1.TransactionStatus.SUCCESS,
                }
            });
            yield tx.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: "PAID",
                },
            });
            return transaction;
        }));
        return payment;
    }
    return payment;
});
exports.paymentService = {
    makePayment,
    paymentConfirmation,
};
