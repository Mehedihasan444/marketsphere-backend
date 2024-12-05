"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest "));
const client_1 = require("@prisma/client");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
exports.UserRoutes = router;
//create admin
router.post("/create-admin", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserControllers.createAdmin);
// create vendor
router.post("/create-vendor", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserControllers.createVendor);
// create customer
router.post("/create-customer", (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserControllers.createCustomer);
// get all users
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), user_controller_1.UserControllers.getAllUsers);
// get my profile
router.get("/me", (0, auth_1.default)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN), user_controller_1.UserControllers.getMyProfile);
// update my profile
router.patch("/update-my-profile", (0, auth_1.default)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN), sendImageToCloudinary_1.upload.single("profilePhoto"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, user_controller_1.UserControllers.updateMyProfile);
// change profile status
router.patch("/:id/status", (0, auth_1.default)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN), user_controller_1.UserControllers.changeProfileStatus);
// delete user
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN), user_controller_1.UserControllers.deleteUser);
