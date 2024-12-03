import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { OrderFilterableFields } from "./order.constant";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const order = await OrderServices.createOrder(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order Created Successfully",
    data: order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const filters = pick(req.query, OrderFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const orders = await OrderServices.getAllOrdersFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders Retrieved Successfully",
    data: orders,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const order = await OrderServices.getSingleOrderFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order Retrieved Successfully",
    data: order,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  await OrderServices.deleteOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order Deleted Successfully",
    data: null,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.updateOrder(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order Updated Successfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  updateOrder,
};
