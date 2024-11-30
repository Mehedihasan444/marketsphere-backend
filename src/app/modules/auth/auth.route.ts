import express from "express";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { USER_ROLE } from "../User/user.constant";

import auth from "../../middlewares/auth";
import validateRequest, { validateRequestCookies } from "../../middlewares/validateRequest ";

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
  "/social-login",
  validateRequest(AuthValidation.socialLoginValidationSchema),
  AuthControllers.socialLoginUser
);

router.post(
  "/reset-password",
  auth(USER_ROLE.BUYER, USER_ROLE.ADMIN,USER_ROLE.SELLER),
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword
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
