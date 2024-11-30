/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  const countQuery = new QueryBuilder(User.find(), query).filter().search(UserSearchableFields);

  const totalCount = await countQuery.modelQuery.countDocuments();


  return{totalCount,users: result};
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);

  return user;
};

const deleteUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role === "ADMIN") {
    throw new Error("You can not delete an admin user");
  }
  const result = await User.findByIdAndDelete(userId);
  return result;
};
const updateProfilePhoto = async (
  payload: Record<string, unknown>,
  image: TImageFiles
) => {
  // console.log(image.image[0].path, "image");
  const result = await User.findByIdAndUpdate(
    payload?.userId,
    { profilePhoto: image.image[0].path },
    { new: true }
  );
  return result;
};
const updateUser = async (userId: string, payload: TUser) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await User.findByIdAndUpdate(userId, payload, { new: true });
  return result;
};
export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateProfilePhoto,
  updateUser,
};
