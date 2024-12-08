import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { ShopServices } from "./shop.service";

const getAllShops = catchAsync(async (req, res) => {
  const shops = await ShopServices.getAllShopsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shops retrieved successfully",
    data: shops,
  });
});

const createShop = catchAsync(async (req, res) => {
  const data=req.body
  const images=req.files


  const shop = await ShopServices.createShopIntoDB(data,images);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop created successfully",
    data: shop,
  });
});
const getSingleShop = catchAsync(async (req, res) => {
  const shop = await ShopServices.getSingleShopFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop retrieved successfully",
    data: shop,
  });
});

const deleteShop = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ShopServices.deleteShopFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop deleted successfully",
    data: null,
  });
});

const updateShop = catchAsync(async (req, res) => {
  await ShopServices.updateShopInDB(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop updated successfully",
    data: null,
  });
});

export const ShopControllers = {
  createShop,
  getAllShops,
  getSingleShop,
  deleteShop,
  updateShop,
};
