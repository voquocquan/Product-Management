const systemConfig = require("../../config/system")

const dashboardRouters = require("./dashboard.route")
const productRouters = require("./product.route")
const productCategoryRouters = require("./product-category.route")
const roleRouters = require("./role.route")

module.exports = (app) => {
    const PATCH_ADMIN = systemConfig.preFixAdmin;

    app.use( PATCH_ADMIN + "/dashboard", dashboardRouters);

    app.use( PATCH_ADMIN + "/products", productRouters);

    app.use( PATCH_ADMIN + "/products-category", productCategoryRouters);

    app.use( PATCH_ADMIN + "/roles", roleRouters);
}