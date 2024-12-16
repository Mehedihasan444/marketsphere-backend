import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { WishlistControllers } from "./wishlist.controller";

const router = express.Router();


// Route to add a product to the wishlist (accessible by authenticated users)
router.post(
    "/",
    auth(Role.CUSTOMER),
    WishlistControllers.addToWishlist
);
// Route to get all items in the wishlist for the logged-in user (accessible by authenticated users)
router.get("/", auth(Role.CUSTOMER), WishlistControllers.getWishlistItems);


// Route to clear the wishlist (accessible by authenticated users)
router.delete("/:id/clear-wishlist", auth(Role.CUSTOMER), WishlistControllers.clearWishlist);

// Route to remove a single product from the wishlist (accessible by authenticated users)
router.delete("/:id", auth(Role.CUSTOMER), WishlistControllers.removeWishlistItem);

export const WishlistRoutes = router;