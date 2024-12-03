import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest ";
import { orderValidationSchema } from "./order.validation";
import { OrderControllers } from "./order.controller";

const router = express.Router();

export const OrderRoutes = router;

// Route to create a new order (only accessible by Customers)
router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(orderValidationSchema.createOrderValidationSchema),
  OrderControllers.createOrder
);

// Route to get all orders (only accessible by Admins)
router.get(
  "/",
  auth(Role.ADMIN),
  OrderControllers.getAllOrders
);

// Route to update an order (only accessible by Admins)
router.put(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(orderValidationSchema.updateOrderValidationSchema),
  OrderControllers.updateOrder
);

// Route to get a single order (only accessible by the Customer who created it or Admin)
router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  OrderControllers.getSingleOrder
);

// Route to delete an order (only accessible by Admins)
router.delete(
  "/:id",
  auth(Role.ADMIN),
  OrderControllers.deleteOrder
);