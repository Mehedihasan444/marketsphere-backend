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
exports.verifyPayment = exports.initiatePayment = exports.generateTransactionId = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const generateTransactionId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomNum = Math.floor(Math.random() * 1e12).toString(36); // Generate a random number and convert to base-36
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
    return `TX-${timestamp}-${randomNum}-${randomString}`.toUpperCase(); // Combine parts and return in uppercase
};
exports.generateTransactionId = generateTransactionId;
const initiatePayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, amount, transactionId } = paymentData;
    const order = yield prisma_1.default.order.findFirstOrThrow({
        where: {
            id: orderId,
        }
    });
    const { name, email, phone, address, zipCode, city, country, state } = order || {};
    const response = yield axios_1.default.post(process.env.PAYMENT_URL, {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        tran_id: transactionId,
        success_url: `${config_1.default.server_url}/api/v1/payment/confirmation?transactionId=${transactionId}&orderId=${orderId}`,
        fail_url: `${config_1.default.server_url}/api/v1/payment/failed?transactionId=${transactionId}&orderId=${orderId}`,
        cancel_url: `${config_1.default.client_url}`,
        amount: amount,
        currency: "USD",
        desc: "Merchant Registration Payment",
        cus_name: name,
        cus_email: email,
        cus_add1: address,
        cus_add2: "N/A",
        cus_city: city,
        cus_state: state,
        cus_postcode: zipCode,
        cus_country: country,
        cus_phone: phone,
        type: "json",
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(process.env.PAYMENT_VERIFY_URL, {
        params: {
            store_id: process.env.STORE_ID,
            signature_key: process.env.SIGNATURE_KEY,
            request_id: transactionId,
            type: "json",
        },
    });
    return response.data;
});
exports.verifyPayment = verifyPayment;
