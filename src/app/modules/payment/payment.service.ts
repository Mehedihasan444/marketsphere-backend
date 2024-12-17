import { TransactionStatus } from "@prisma/client";
import prisma from "../../config/prisma"
import { generateTransactionId, initiatePayment, verifyPayment } from "./payment.utils"

const makePayment = async (paymentData: any) => {
    const { orderId, amount } = paymentData
    // **
    // orderId
    // amount
    // **
    const transactionId = generateTransactionId();

    const res =await prisma.order.findFirstOrThrow({
        where: {
            id: orderId
        }
    })

    paymentData.transactionId = transactionId;
  await prisma.transaction.create({
        data: paymentData
    })
    const paymentSession = await initiatePayment(paymentData);

    return paymentSession
}

const paymentConfirmation = async ({ transactionId, orderId, }: { transactionId: string; orderId: string; }) => {
    let payment;
    const verifyResponse = await verifyPayment(transactionId);
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const payment = await prisma.$transaction(async (tx) => {

            const transaction = await tx.transaction.update({
                where: { orderId },
                data: {
                    status: TransactionStatus.SUCCESS,

                }
            });
            await tx.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: "PAID",
                },
            }

            );
            return transaction;
        })
        return payment;
    }

    return payment;
};

export const paymentService = {
    makePayment,
    paymentConfirmation,
}