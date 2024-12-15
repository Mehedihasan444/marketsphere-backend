"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BecomeVendorRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const becomeVendorRequest_controller_1 = require("./becomeVendorRequest.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.Role.CUSTOMER), becomeVendorRequest_controller_1.BecomeVendorRequestControllers.InsertBecomeVendorRequest);
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), becomeVendorRequest_controller_1.BecomeVendorRequestControllers.getAllBecomeVendorRequests);
router.patch("/:id/status", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), becomeVendorRequest_controller_1.BecomeVendorRequestControllers.updateBecomeVendorRequest);
router.get("/:id", (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), becomeVendorRequest_controller_1.BecomeVendorRequestControllers.getSingleBecomeVendorRequest);
router.delete("/:id", (0, auth_1.default)(client_1.Role.CUSTOMER), becomeVendorRequest_controller_1.BecomeVendorRequestControllers.deleteBecomeVendorRequest);
exports.BecomeVendorRequestRoutes = router;
