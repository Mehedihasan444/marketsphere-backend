"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest "));
const router = express_1.default.Router();
exports.UserRoutes = router;
router.post("/create-user", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserControllers.userRegister);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), user_controller_1.UserControllers.getAllUsers);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), user_controller_1.UserControllers.updateUser);
router.get("/:id", user_controller_1.UserControllers.getSingleUser);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), user_controller_1.UserControllers.deleteUser);
