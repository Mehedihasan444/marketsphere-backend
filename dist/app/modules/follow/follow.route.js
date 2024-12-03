"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const follow_controller_1 = require("./follow.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest "));
const follow_validation_1 = require("./follow.validation");
const router = express_1.default.Router();
router.post("/follow", (0, validateRequest_1.default)(follow_validation_1.FollowValidationSchema.followValidationSchema), follow_controller_1.FollowControllers.followShop);
router.post("/unfollow", (0, validateRequest_1.default)(follow_validation_1.FollowValidationSchema.unfollowValidationSchema), follow_controller_1.FollowControllers.unfollowShop);
exports.FollowRoutes = router;
