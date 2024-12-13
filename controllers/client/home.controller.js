const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/product")

// [GET]  /
module.exports.index = async (req, res) => { 
    //Sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(3);

    const newProductsFeatured = productsHelper.priceNewProduct(productsFeatured);
    
    //End Sản phẩm nổi bật

    //Sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc"}).limit(6);

    const newProductsNew = productsHelper.priceNewProduct(productsNew);

    //end Sản phẩm mới nhất

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew

    })
}