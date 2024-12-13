const categoryMiddleware = require("../../middlewares/client/category.middleware")

const productsRouters = require("./products.route")
const homeRouters = require("./home.route")

module.exports = (app) => {
    app.use(categoryMiddleware.category)

    app.use('/', homeRouters)
    
    app.use("/products", productsRouters) 
}