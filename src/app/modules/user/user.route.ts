import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest ";
import { Role } from "@prisma/client";

const router = express.Router();

export const UserRoutes = router;

router.post(
  "/create-admin",
  auth(Role.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createAdmin
);
router.post(
  "/create-vendor",
  auth(Role.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createVendor
);
router.post(
  "/create-customer",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createCustomer
);
router.get("/", auth(Role.ADMIN), UserControllers.getAllUsers);
router.put("/:id", auth(Role.ADMIN), UserControllers.updateUser);
router.get("/:id", UserControllers.getSingleUser);
router.delete("/:id", auth(Role.ADMIN), UserControllers.deleteUser);
