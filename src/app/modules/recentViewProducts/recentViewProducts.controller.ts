import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"
import { RecentViewProductsServices } from "./recentViewProducts.service"
import { IAuthUser } from "../user/user.constant"
const createRecentViewProduct = catchAsync(async (req, res) => {
const productId = req.body.productId
const user = req.user as IAuthUser
const result = await RecentViewProductsServices.createRecentViewProduct(user?.email as string, productId)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Recent view product created successfully",
        data: ""
    })
})

const getRecentViewProducts = catchAsync(async (req, res) => {
const user = req.user as IAuthUser
const result = await RecentViewProductsServices.getRecentViewProducts(user?.email as string)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Recent view products fetched successfully",
        data: result
    })
})
export const RecentViewProductsControllers = {
    createRecentViewProduct,
    getRecentViewProducts
}