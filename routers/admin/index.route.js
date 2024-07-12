const systemConfig = require("../../config/system")

const dashboardRouters = require("./dashboard.route")
const productdRouters = require("./product.route")

module.exports = (app) => {
    const PATCH_ADMIN = systemConfig.preFixAdmin;

    app.use( PATCH_ADMIN + "/dashboard", dashboardRouters)
    app.use( PATCH_ADMIN + "/products", productdRouters)
}