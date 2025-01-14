import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { ShopServices } from "./shop.service";
import { ShopFilterableFields } from "./shop.constant";

const getAllShops = catchAsync(async (req, res) => {
  const filters = pick(req.query, ShopFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const shops = await ShopServices.getAllShopsFromDB(filters, options);

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
  const data=req.body
  const images=req.files
 const shop= await ShopServices.updateShopInDB(req.params.id,data,images);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop updated successfully",
    data: shop,
  });
});
const updateShopStatus = catchAsync(async (req, res) => {
  const data=req.body

 const shop= await ShopServices.updateShopStatus(req.params.id,data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop status updated successfully",
    data: shop,
  });
});

export const ShopControllers = {
  createShop,
  getAllShops,
  getSingleShop,
  deleteShop,
  updateShop,
  updateShopStatus,
};
