import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistServices } from "./wishlist.service";

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const wishlist = await WishlistServices.addToWishlist(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wishlist item added Successfully",
    data: wishlist,
  });
});

const getWishlistItems = catchAsync(async (req: Request, res: Response) => {
 const user= req.user;
  const wishlists = await WishlistServices.getWishlistItems(user.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wishlist items Retrieved Successfully",
    data: wishlists,
  });
});



const removeWishlistItem = catchAsync(async (req: Request, res: Response) => {
  const wishlistItemId = req.params.id;
  await WishlistServices.removeWishlistItem(wishlistItemId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wishlist Item removed Successfully",
    data: null,
  });
});
const clearWishlist = catchAsync(async (req: Request, res: Response) => {
  const  wishlistId  = req.params.id;

  await WishlistServices.clearWishlist(wishlistId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wishlist cleared Successfully",
    data: null,
  });
});


export const WishlistControllers = {
  addToWishlist,
  getWishlistItems,
  removeWishlistItem,
  clearWishlist
};
