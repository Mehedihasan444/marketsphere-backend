import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { ProductFilterableFields } from "./product.constant";
import { ProductServices } from "./product.service";
import httpStatus from "http-status";
const createProduct = catchAsync(async (req, res) => {

    const product = await ProductServices.createProduct(req.files,req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product Created Successfully",
      data: product,
    });
  });
  
  const getAllProducts = catchAsync(async (req, res) => {
    const filters = pick(req.query, ProductFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
 

    const products = await ProductServices.getAllProductsFromDB(filters, options);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Products Retrieved Successfully",
      data: products,
    });
  });
  
  const getSingleProduct = catchAsync(async (req, res) => {
    const product = await ProductServices.getSingleProductFromDB(req.params.id);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product Retrieved Successfully",
      data: product,
    });
  });
  
  const deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    await ProductServices.deleteProductFromDB(id);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product Deleted Successfully",
      data: null,
    });
  });
  
  const updateProduct = catchAsync(async (req, res) => {
    const result = await ProductServices.updateProduct(req.params.id, req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product Updated Successfully",
      data: result,
    });
  });
  
  export const ProductControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct,
  };
  