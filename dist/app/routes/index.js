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
const flashSale_route_1 = require("../modules/flashSale/flashSale.route");
const coupon_route_1 = require("../modules/coupon/coupon.route");
const shop_route_1 = require("../modules/shop/shop.route");
const becomeVendorRequest_route_1 = require("../modules/becomeVendorRequest/becomeVendorRequest.route");
const dashboard_route_1 = require("../modules/DashBoard/dashboard.route");
const payment_route_1 = require("../modules/payment/payment.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const wishlist_route_1 = require("../modules/wishlist/wishlist.route");
const recentViewProducts_route_1 = require("../modules/recentViewProducts/recentViewProducts.route");
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
        path: "/flash-sales",
        route: flashSale_route_1.FlashSaleRoutes,
    },
    {
        path: "/follow-shop",
        route: follow_route_1.FollowRoutes,
    },
    {
        path: "/coupons",
        route: coupon_route_1.CouponRoutes,
    },
    {
        path: "/shops",
        route: shop_route_1.ShopRoutes,
    },
    {
        path: "/dashboard",
        route: dashboard_route_1.DashboardRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/become-a-vendor",
        route: becomeVendorRequest_route_1.BecomeVendorRequestRoutes,
    },
    {
        path: "/transactions",
        route: transaction_route_1.TransactionRoutes,
    },
    {
        path: "/wishlist",
        route: wishlist_route_1.WishlistRoutes
    }, {
        path: "/recent-view-products",
        route: recentViewProducts_route_1.RecentViewProductsRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
