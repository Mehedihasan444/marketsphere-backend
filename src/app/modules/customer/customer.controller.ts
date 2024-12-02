import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { CustomerFilterableFields } from "./customer.constant";
import { CustomerServices } from "./customer.service";

const getAllCustomers = catchAsync(async (req, res) => {
  const filters = pick(req.query, CustomerFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const customers = await CustomerServices.getAllCustomersFromDB(
    filters,
    options
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customers Retrieved Successfully",
    data: customers,
  });
});

const getSingleCustomer = catchAsync(async (req, res) => {
  const customer = await CustomerServices.getSingleCustomerFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer Retrieved Successfully",
    data: customer,
  });
});

const deleteCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CustomerServices.deleteCustomerFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer deleted successfully",
    data: null,
  });
});
const updateCustomer = catchAsync(async (req, res) => {
  await CustomerServices.updateCustomer(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer updated successfully",
    data: null,
  });
});

export const CustomerControllers = {
  getAllCustomers,
  getSingleCustomer,
  deleteCustomer,
  updateCustomer,
};
