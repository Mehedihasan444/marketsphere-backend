import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import pick from "../../utils/pick";
import { IAuthUser, userFilterableFields } from "./user.constant";

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
  console.log(options);
  const users = await UserServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users,
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

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await UserServices.getMyProfile(user as IAuthUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});
const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await UserServices.updateMyProfile(
    user as IAuthUser,
    req as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile updated!",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createVendor,
  createCustomer,
  getAllUsers,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  changeProfileStatus,

};
