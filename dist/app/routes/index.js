"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const customer_route_1 = require("../modules/customer/customer.route");
const admin_route_1 = require("../modules/admin/admin.route");
const vendor_route_1 = require("../modules/vendor/vendor.route");
const category_route_1 = require("../modules/category/category.route");
const cart_route_1 = require("../modules/cart/cart.route");
const order_route_1 = require("../modules/order/order.route");
const product_route_1 = require("../modules/product/product.route");
const review_route_1 = require("../modules/review/review.route");
const follow_route_1 = require("../modules/follow/follow.route");
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
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/cart",
        route: cart_route_1.CartRoutes,
    },
    {
        path: "/orders",
        route: order_route_1.OrderRoutes,
    },
    {
        path: "/products",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/reviews",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/follow-shop",
        route: follow_route_1.FollowRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
