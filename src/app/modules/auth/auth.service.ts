import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import { createToken } from "../../utils/verifyToken";
import { EmailHelper } from "../../utils/emailSender";
import prisma from "../../config/prisma";
import { isJWTIssuedBeforePasswordChanged } from "../../utils/isJWTIssuedBeforePasswordChanged";
import { Role, User, UserStatus } from "@prisma/client";

const registerUser = async (payload: User) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is already exist!");
  }

  payload.role = Role.CUSTOMER;

  //hash password
  const hashedPassword = await bcrypt.hash(
    payload.password as string,
    Number(config.bcrypt_salt_rounds)
  );

  payload.password = hashedPassword;
  //create new user
  const newUser = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: {
        ...payload,
      },
    });
   await transactionClient.customer.create({
      data: {
        name: user.name,
        email: user.email,
      },
    });
    return user;
  });

  //create token and sent to the  client

  const jwtPayload = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }
  if (!(await bcrypt.compare(payload.password, user.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //create token and sent to the  client

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const resetPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  // checking if the user is exist
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  if (!(await bcrypt.compare(oldPassword, user.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: {
      email: user.email,
      role: user.role,
    },
    data: {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  });

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await prisma.user.findFirstOrThrow({ where: { email } });

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }
  // checking if the token is issued before the password changed
  if (
    user.passwordChangedAt &&
    isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await prisma.user.findFirstOrThrow({ where: { email } });

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const jwtPayload = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;

  EmailHelper.sendEmail(user?.email, resetUILink);
  return null;
};
const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};
export const AuthServices = {
  registerUser,
  loginUser,
  resetPassword,
  refreshToken,
  forgetPassword,
  changePassword,
};
