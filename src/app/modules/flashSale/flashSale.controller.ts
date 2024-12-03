import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FlashSaleServices } from "./flashSale.service";

const createFlashSale = catchAsync(async (req, res) => {
  const data = req.body;
  const flashSale = await FlashSaleServices.createFlashSale(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FlashSale created Successfully",
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

export const FlashSaleControllers = {
  createFlashSale,
  getAllFlashSales,
  getSingleFlashSale,
  deleteFlashSale
};
