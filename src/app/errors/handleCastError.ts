import { Prisma } from '@prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [];

  if (err.code === 'P2023') {
    // Invalid ID error
    errorSources.push({
      path: 'id',
      message: 'Invalid ID',
    });
  } else {
    // Other Prisma errors
    errorSources.push({
      path: 'unknown',
      message: err.message,
    });
  }

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;
