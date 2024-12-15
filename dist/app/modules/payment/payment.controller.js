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
exports.paymentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const payment_service_1 = require("./payment.service");
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const makePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_service_1.paymentService.makePayment(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment successful",
        data: payment
    });
}));
const paymentConfirmation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionId;
    const orderId = req.query.orderId;
    if (!transactionId || !orderId) {
        res.status(http_status_1.default.BAD_REQUEST).send("Invalid transaction or user ID");
        return; // Ensure the function exits early
    }
    yield payment_service_1.paymentService.paymentConfirmation({
        transactionId,
        orderId,
    });
    return res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f9;
          }
          .container {
            text-align: center;
            padding: 50px;
            background: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          h1 {
            color: #4CAF50;
            font-size: 2.5em;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.2em;
            color: #555555;
            margin-bottom: 30px;
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Success</h1>
          <p>Thank you for your payment! Your transaction has been successfully completed.</p>
          <a href="${config_1.default.client_url}" class="button">Go to Home</a>
        </div>
      </body>
    </html>
  `);
}));
const paymentFailed = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.query.orderId;
    yield prisma_1.default.transaction.update({
        where: { orderId },
        data: {
            status: client_1.TransactionStatus.FAILED,
        }
    });
    return res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f9;
          }
          .container {
            text-align: center;
            padding: 50px;
            background: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          h1 {
            color: #E74C3C;
            font-size: 2.5em;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.2em;
            color: #555555;
            margin-bottom: 30px;
          }
          .button {
            background-color: #E74C3C;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #C0392B;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Failed</h1>
          <p>We're sorry, but your payment could not be processed. Please try again.</p>
          <a href="${config_1.default.client_url}/subscription" class="button">Retry Payment</a>
        </div>
      </body>
    </html>
  `);
}));
exports.paymentControllers = {
    makePayment,
    paymentConfirmation,
    paymentFailed,
};
