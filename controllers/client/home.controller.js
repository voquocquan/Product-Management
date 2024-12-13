const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/product")

// [GET]  /
module.exports.index = async (req, res) => { 
    //Sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);

    const newProducts = productsHelper.priceNewProduct(productsFeatured);
    
    //End Sản phẩm nổi bật

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts
    })
}