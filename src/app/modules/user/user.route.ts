import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { parseBody } from "../../middlewares/bodyParser";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

export const UserRoutes = router;

router.post(
  "/create-user",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);
router.get("/", auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);
router.put(
  "/update-profile-photo",
  multerUpload.fields([{ name: "image" }]),
  parseBody,
  UserControllers.updateProfilePhoto
);
router.put("/:id", auth(USER_ROLE.ADMIN), UserControllers.updateUser);
router.get("/:id", UserControllers.getSingleUser);
router.delete("/:id", auth(USER_ROLE.ADMIN), UserControllers.deleteUser);
