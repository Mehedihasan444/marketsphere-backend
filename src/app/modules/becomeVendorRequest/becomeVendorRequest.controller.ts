import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BecomeVendorRequestServices } from "./becomeVendorRequest.service";
import httpStatus from "http-status";
const InsertBecomeVendorRequest = catchAsync(async (req, res) => {

  const BecomeVendorRequest = await BecomeVendorRequestServices.InsertBecomeVendorRequest(
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Request send Successfully",
    data: BecomeVendorRequest,
  });
});

const getAllBecomeVendorRequests = catchAsync(async (req, res) => {
  const BecomeVendorRequest = await BecomeVendorRequestServices.getAllBecomeVendorRequests();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All request retrieved Successfully",
    data: BecomeVendorRequest,
  });
});
const getSingleBecomeVendorRequest = catchAsync(async (req, res) => {
  const BecomeVendorRequest = await BecomeVendorRequestServices.getSingleBecomeVendorRequest(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Request retrieved Successfully",
    data: BecomeVendorRequest,
  });
});
const deleteBecomeVendorRequest = catchAsync(async (req, res) => {
  const BecomeVendorRequest = await BecomeVendorRequestServices.deleteBecomeVendorRequest(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Request canceled Successfully",
    data: BecomeVendorRequest,
  });
});
const updateBecomeVendorRequest = catchAsync(async (req, res) => {
  const BecomeVendorRequest = await BecomeVendorRequestServices.updateBecomeVendorRequest(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Status updated Successfully",
    data: BecomeVendorRequest,
  });
});

export const BecomeVendorRequestControllers = {
  InsertBecomeVendorRequest,
  getAllBecomeVendorRequests,
  getSingleBecomeVendorRequest,
  deleteBecomeVendorRequest,
  updateBecomeVendorRequest,
};
