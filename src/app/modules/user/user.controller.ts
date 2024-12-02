import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async (req, res) => {
  const admin = await UserServices.createAdmin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin Created Successfully",
    data: admin,
  });
});
const createVendor = catchAsync(async (req, res) => {
  const vendor = await UserServices.createVendor(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor Created Successfully",
    data: vendor,
  });
});
const createCustomer = catchAsync(async (req, res) => {
  const customer = await UserServices.createCustomer(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer Created Successfully",
    data: customer,
  });
});

const getAllUsers = catchAsync(async (req, res) => {

  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
console.log(options)
  const users = await UserServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUser(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createVendor,
  createCustomer,
  getSingleUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
