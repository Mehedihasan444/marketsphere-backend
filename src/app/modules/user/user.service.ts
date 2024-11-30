/* eslint-disable @typescript-eslint/no-explicit-any */
import { TImageFiles } from "../../interface/image.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import prisma from "../../config/prisma";

const createUser = async (payload: TUser) => {
  const user = await prisma.user.create({ data: payload });

  return user;
};
// ! Get all users from the database
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = await prisma.user.findMany({
    where: query,
    select: {
      // Add fields you want to select here
    },
    orderBy: {
      // Add sorting logic here
    },
    skip: query.skip as number | undefined,
    take: query.take as number | undefined,
  });

  const totalCount = await prisma.user.count({
    where: query,
  });

  return { totalCount, users };
};

const getSingleUserFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  return user;
};

const deleteUserFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.role === "ADMIN") {
    throw new Error("You can not delete an admin user");
  }
  const result = await prisma.user.delete({ where: { id: userId } });
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
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
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
