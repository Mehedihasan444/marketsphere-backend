import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { DashboardServices } from "./dashboard.service";
const getAdminDashboardData = catchAsync(async (req, res) => {
  const result = await DashboardServices.getAdminDashboardData();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin dashboard data fetched successfully",
    data: result,
  });
});
const getVendorDashboardData = catchAsync(async (req, res) => {
  const result = await DashboardServices.getVendorDashboardData();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor dashboard data fetched successfully",
    data: result,
  });
});
const getCustomerDashboardData = catchAsync(async (req, res) => {
    const result = await DashboardServices.getCustomerDashboardData();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "VCustomer dashboard data fetched successfully",
      data: result,
    });
  })

export const DashboardControllers = {
  getAdminDashboardData,
  getCustomerDashboardData,
  getVendorDashboardData,
};
