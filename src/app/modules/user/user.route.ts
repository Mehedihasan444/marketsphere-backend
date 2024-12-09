import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "@prisma/client";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

export const UserRoutes = router;

//create admin
router.post(
  "/create-admin",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createAdmin
); 
// create vendor
router.post(
  "/create-vendor",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createVendor
);
// create customer
router.post(
  "/create-customer",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createCustomer
);
// get all users
router.get("/", auth(Role.ADMIN), UserControllers.getAllUsers);
// get my profile
router.get(
  "/me",
  auth(Role.SUPER_ADMIN, Role.ADMIN, Role.VENDOR, Role.CUSTOMER),
  UserControllers.getMyProfile
);
// update my profile
router.patch(
  "/update-my-profile",
  auth(Role.SUPER_ADMIN, Role.ADMIN, Role.VENDOR, Role.CUSTOMER),
  upload.single("profilePhoto"),
  (req:Request, res:Response, next:NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  UserControllers.updateMyProfile
);
// change profile status
router.patch(
  "/:id/status",
  auth(Role.SUPER_ADMIN, Role.ADMIN),
  UserControllers.changeProfileStatus
);

// delete user
router.delete("/:id", auth(Role.ADMIN), UserControllers.deleteUser);
