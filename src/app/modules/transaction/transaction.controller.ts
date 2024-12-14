import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { TransactionFilterableFields } from "./transaction.constant";
import { transactionService } from "./transaction.service";
import httpStatus from "http-status";

const getAllTransactions=catchAsync(async (req, res) => {
    const filters = pick(req.query, TransactionFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
 
const transactions = await transactionService.getAllTransactions(filters, options);
    return sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "All transactions fetched successfully",
        data: transactions
    })
})

export const transactionController = {
    getAllTransactions
}