"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const customer_route_1 = require("../modules/customer/customer.route");
const admin_route_1 = require("../modules/admin/admin.route");
const vendor_route_1 = require("../modules/vendor/vendor.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/customers",
        route: customer_route_1.CustomerRoutes,
    },
    {
        path: "/admins",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/vendors",
        route: vendor_route_1.VendorRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
