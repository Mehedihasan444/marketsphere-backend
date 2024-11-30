import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  token?:string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode:data?.statusCode,
    message: Array.isArray(data.data) && data.data.length === 0 ? "No data found." : data.message,
    data: data.data,
    // Array.isArray(data.data) && data.data.length === 0 ? "Database is empty" : data.data,
    token:data.token
  });
};

export default sendResponse;