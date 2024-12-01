import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest ";

const router = express.Router();

export const UserRoutes = router;

router.post(
  "/create-admin",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createAdmin
);
router.post(
  "/create-vendor",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createVendor
);
router.post(
  "/create-customer",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createCustomer
);
router.get("/", auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);
router.put("/:id", auth(USER_ROLE.ADMIN), UserControllers.updateUser);
router.get("/:id", UserControllers.getSingleUser);
router.delete("/:id", auth(USER_ROLE.ADMIN), UserControllers.deleteUser);
