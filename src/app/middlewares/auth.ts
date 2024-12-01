import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { verifyToken } from "../utils/verifyToken";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { USER_ROLE } from "../modules/user/user.constant";
import prisma from "../config/prisma";
import { isJWTIssuedBeforePasswordChanged } from "../utils/isJWTIssuedBeforePasswordChanged";

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // checking if the user is exist
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    // checking if the user is already deleted

    const status = user?.status;

    if (status === "BLOCKED") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked !");
    }

    if (
      user.passwordChangedAt &&
      isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
