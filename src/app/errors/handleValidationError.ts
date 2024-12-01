import { Prisma } from '@prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [];

  if (err.code === 'P2002') {
    // Unique constraint failed
    const meta = err.meta as { target: string[] };
    meta.target.forEach((field) => {
      errorSources.push({
        path: field,
        message: `${field} must be unique`,
      });
    });
  } else {
    // Other Prisma validation errors
    errorSources.push({
      path: 'unknown',
      message: err.message,
    });
  }

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;
