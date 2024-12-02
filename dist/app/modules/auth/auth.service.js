"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const verifyToken_1 = require("../../utils/verifyToken");
const emailSender_1 = require("../../utils/emailSender");
const prisma_1 = __importDefault(require("../../config/prisma"));
const isJWTIssuedBeforePasswordChanged_1 = require("../../utils/isJWTIssuedBeforePasswordChanged");
const client_1 = require("@prisma/client");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is already exist!");
    }
    payload.role = client_1.Role.CUSTOMER;
    //hash password
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    payload.password = hashedPassword;
    //create new user
    const newUser = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: Object.assign({}, payload),
        });
        yield transactionClient.customer.create({
            data: {
                userId: user.id,
            },
        });
        return user;
    }));
    //create token and sent to the  client
    const jwtPayload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
    };
    const accessToken = (0, verifyToken_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyToken_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked!");
    }
    if (!(yield bcryptjs_1.default.compare(payload.password, user.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password do not matched");
    //create token and sent to the  client
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
    };
    const accessToken = (0, verifyToken_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyToken_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const resetPassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id: userId } });
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked!");
    }
    if (!(yield bcryptjs_1.default.compare(oldPassword, user.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password do not matched");
    //hash new password
    const newHashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: {
            email: user.email,
            role: user.role,
        },
        data: {
            password: newHashedPassword,
            passwordChangedAt: new Date(),
        },
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email, iat } = decoded;
    // checking if the user is exist
    const user = yield prisma_1.default.user.findFirstOrThrow({ where: { email } });
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked!");
    }
    // checking if the token is issued before the password changed
    if (user.passwordChangedAt &&
        (0, isJWTIssuedBeforePasswordChanged_1.isJWTIssuedBeforePasswordChanged)(user.passwordChangedAt, iat)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized !");
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
    };
    const accessToken = (0, verifyToken_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield prisma_1.default.user.findFirstOrThrow({ where: { email } });
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked ! !");
    }
    const jwtPayload = {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
    };
    const resetToken = (0, verifyToken_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10m");
    const resetUILink = `${config_1.default.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;
    emailSender_1.EmailHelper.sendEmail(user === null || user === void 0 ? void 0 : user.email, resetUILink);
    return null;
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password changed successfully!",
    };
});
exports.AuthServices = {
    registerUser,
    loginUser,
    resetPassword,
    refreshToken,
    forgetPassword,
    changePassword,
};
