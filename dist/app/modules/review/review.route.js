"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
exports.ReviewRoutes = router;
// Route to create a new Review (only accessible by Admins)
router.post("/", (0, auth_1.default)(client_1.Role.CUSTOMER), (0, validateRequest_1.default)(review_validation_1.reviewValidationSchema.createReviewValidationSchema), review_controller_1.ReviewControllers.createReview);
// Route to get all reviews (publicly accessible)
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.CUSTOMER, client_1.Role.VENDOR), review_controller_1.ReviewControllers.getAllReviews);
// Route to get all reviews (publicly accessible)
router.get("/product/:id", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.CUSTOMER, client_1.Role.VENDOR), review_controller_1.ReviewControllers.getProductReviews);
// Route to update a Review (only accessible by Admins)
router.put("/:id", (0, auth_1.default)(client_1.Role.CUSTOMER), (0, validateRequest_1.default)(review_validation_1.reviewValidationSchema.updateReviewValidationSchema), review_controller_1.ReviewControllers.updateReview);
// Route to get a single Review (publicly accessible)
router.get("/:id", (0, auth_1.default)(client_1.Role.CUSTOMER), review_controller_1.ReviewControllers.getSingleReview);
// Route to delete a Review (only accessible by Admins)
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN, client_1.Role.VENDOR), review_controller_1.ReviewControllers.deleteReview);
