const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")

const productsHelper = require("../../helpers/product")
const productsCategoryHelper = require("../../helpers/product-category")


// [GET]  /products
module.exports.index = async (req, res) => {
const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc"});

    const newProducts = productsHelper.priceNewProduct(products);
    res.render("client/pages/products/index.pug",{
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
};


// [GET]  /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };

        const product = await Product.findOne(find);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        // req.flash("error", `Không tìm thấy trang!`);
        res.redirect(`/products`);
    }
};

// [GET]  /products/:slugCategory
module.exports.category = async (req, res) => {
    
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId]},
        deleted: false
    }).sort({ position: "desc"});

    const newProducts = productsHelper.priceNewProduct(products);
    
    res.render("client/pages/products/index.pug",{
        pageTitle: category.title,
        products: newProducts
    });
}