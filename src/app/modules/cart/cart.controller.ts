import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CartServices } from "./cart.service";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await CartServices.addToCart(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart item added Successfully",
    data: cart,
  });
});

const getCartItems = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.params.id;
  const carts = await CartServices.getCartItems(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart items Retrieved Successfully",
    data: carts,
  });
});


const updateCartItem = catchAsync(async (req: Request, res: Response) => {
    const result = await CartServices.updateCartItem(req.params.id, req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart item Updated Successfully",
      data: result,
    });
  });
const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const cartItemId = req.params.id;
  await CartServices.removeCartItem(cartItemId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart Item removed Successfully",
    data: null,
  });
});
const clearCart = catchAsync(async (req: Request, res: Response) => {
  const  cartId  = req.params.id;
  await CartServices.clearCart(cartId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart cleared Successfully",
    data: null,
  });
});


export const CartControllers = {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
  clearCart
};
