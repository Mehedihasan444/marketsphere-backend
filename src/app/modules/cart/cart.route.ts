import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { CartControllers } from "./cart.controller";

const router = express.Router();

export const CartRoutes = router;

// Route to add a product to the cart (accessible by authenticated users)
router.post(
  "/",
  auth(Role.CUSTOMER),
  // validateRequest(cartValidationSchema.addCartValidationSchema),
  CartControllers.addToCart
);

// Route to get all items in the cart for the logged-in user (accessible by authenticated users)
router.get("/", auth(Role.CUSTOMER), CartControllers.getCartItems);


// Route to clear the cart (accessible by authenticated users)
router.delete("/:id/clear-cart", auth(Role.CUSTOMER), CartControllers.clearCart);
// Route to update a cart item (e.g., change quantity, remove item) (accessible by authenticated users)
router.put(
  "/:id",
  auth(Role.CUSTOMER),
  // validateRequest(cartValidationSchema.updateCartValidationSchema),
  CartControllers.updateCartItem
);

// Route to remove a single product from the cart (accessible by authenticated users)
router.delete("/:id", auth(Role.CUSTOMER), CartControllers.removeCartItem);
