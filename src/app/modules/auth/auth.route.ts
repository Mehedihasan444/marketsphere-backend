import express from "express";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import validateRequest, {
  validateRequestCookies,
} from "../../middlewares/validateRequest ";
import { USER_ROLE } from "../user/user.constant";

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
  auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN, USER_ROLE.VENDOR),
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);
router.post(
  "/change-password",
  auth(USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.VENDOR),
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
