import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";
import config from "../../config";
import prisma from "../../config/prisma";
import { TransactionStatus } from "@prisma/client";


const makePayment = catchAsync(async (req, res) => {
    const payment = await paymentService.makePayment(req.body);
   
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment successful",
        data: payment
    })
})




const paymentConfirmation = catchAsync(async (req, res):Promise<any>=> {
    const transactionId = req.query.transactionId as string;
    const orderId = req.query.orderId as string;

    if (!transactionId || !orderId) {
        res.status(httpStatus.BAD_REQUEST).send("Invalid transaction or user ID");
        return; // Ensure the function exits early
    }

    await paymentService.paymentConfirmation({
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
          <a href="${config.client_url}" class="button">Go to Home</a>
        </div>
      </body>
    </html>
  `);
});


const paymentFailed = catchAsync(async (req, res):Promise<any> => {
    const orderId = req.query.orderId as string;
   await prisma.transaction.update({
        where: { orderId },
        data: {
            status: TransactionStatus.FAILED,

        }
    });

  return  res.send(`
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
          <a href="${config.client_url}/subscription" class="button">Retry Payment</a>
        </div>
      </body>
    </html>
  `);
});


export const paymentControllers = {
    makePayment,
    paymentConfirmation,
    paymentFailed,
};