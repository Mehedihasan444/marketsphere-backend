import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../user/user.constant";
import { FlashSaleServices } from "./flashSale.service";
import httpStatus from "http-status";
const createFlashSale = catchAsync(async (req, res) => {
  const data = req.body;
  const file= req.file as any;

  const flashSale = await FlashSaleServices.createFlashSale(file,data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FlashSale created Successfully",
    data: flashSale,
  });
});
const addProductToFlashSale = catchAsync(async (req, res) => {
  const data = req.body;
  const flashSale = await FlashSaleServices.addProductToFlashSale(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product added to FlashSale Successfully",
    data: flashSale,
  });
});
const deleteProductToFlashSale = catchAsync(async (req, res) => {
  const data = req.params.id;
  const flashSale = await FlashSaleServices.deleteProductToFlashSale(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product removed to FlashSale Successfully",
    data: flashSale,
  });
});
const getAllFlashSales = catchAsync(async (req, res) => {
  const flashSale = await FlashSaleServices.getAllFlashSales();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FlashSales retrieved Successfully",
    data: flashSale,
  });
});
const getSingleFlashSale = catchAsync(async (req, res) => {
  const id = req.params.id;
  const flashSale = await FlashSaleServices.getSingleFlashSale(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FlashSale retrieved Successfully",
    data: flashSale,
  });
});

const updateFlashSale = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const flashSale = await FlashSaleServices.updateFlashSale(id, data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FlashSale updated Successfully",
    data: flashSale,
  });
})
const deleteFlashSale = catchAsync(async (req, res) => {
  const id = req.params.id;
  const flashSale = await FlashSaleServices.deleteFlashSale(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FlashSale deleted Successfully",
    data: flashSale,
  });
});


const getVendorProductsInFlashSale = catchAsync(async (req, res) => {
  const products = await FlashSaleServices.getVendorProductsInFlashSale(req.user as IAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved Successfully",
    data: products,
  });
});
const getProductsInFlashSale = catchAsync(async (req, res) => {
  const products = await FlashSaleServices.getProductsInFlashSale();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved Successfully",
    data: products,
  });
});

export const FlashSaleControllers = {
  createFlashSale,
  getAllFlashSales,
  getSingleFlashSale,
  deleteFlashSale,
  addProductToFlashSale,
  updateFlashSale,
  deleteProductToFlashSale,
  getVendorProductsInFlashSale,
  getProductsInFlashSale
};
