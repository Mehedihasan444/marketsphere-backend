import express from "express";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import validateRequest, {
  validateRequestCookies,
} from "../../middlewares/validateRequest ";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/reset-password",
  auth(Role.CUSTOMER, Role.ADMIN, Role.VENDOR),
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);
router.post(
  "/change-password",
  auth(Role.ADMIN, Role.CUSTOMER, Role.VENDOR),
  AuthControllers.changePassword
);
router.post(
  "/refresh-token",
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);

export const AuthRoutes = router;
