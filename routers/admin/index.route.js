const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");
const productCategoryRouters = require("./product-category.route");
const roleRouters = require("./role.route");
const accountRouters = require("./account.route");
const authRouters = require("./auth.route");

module.exports = (app) => {
    const PATCH_ADMIN = systemConfig.preFixAdmin;

    app.use(
        PATCH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRouters
    );

    app.use(
        PATCH_ADMIN + "/products", 
        authMiddleware.requireAuth, 
        productRouters
    );

    app.use(
        PATCH_ADMIN + "/products-category", 
        authMiddleware.requireAuth, 
        productCategoryRouters
    );

    app.use(
        PATCH_ADMIN + "/roles", 
        authMiddleware.requireAuth, 
        roleRouters
    );

    app.use(
        PATCH_ADMIN + "/accounts", 
        authMiddleware.requireAuth, 
        accountRouters
    );

    app.use(PATCH_ADMIN + "/auth", authRouters);
}