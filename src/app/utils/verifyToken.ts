/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import { Role, UserStatus } from '@prisma/client';


export const createToken = (
  jwtPayload: {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
  },
  secret: string,
  expiresIn: any
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string
): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(401, 'JWT expired');
    }
    throw new AppError(401, 'Invalid token');
  }
};