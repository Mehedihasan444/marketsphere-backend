import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { TImageFiles } from "../../interface/image.interface";

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

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
const updateProfilePhoto = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, "No profile picture found");
  }
  await UserServices.updateProfilePhoto(req.body, req.files as TImageFiles);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile picture updated successfully",
    data: null,
  });
});
const updateUser = catchAsync(async (req, res) => {
 
  const result = await UserServices.updateUser(req.params.id,req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
  deleteUser,
  updateProfilePhoto,
  updateUser
};
