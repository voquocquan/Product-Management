
const Product = require ("../../models/product.model")

const filterStatusHelper = require("../../helpers/filter-status")

const searchHelper = require("../../helpers/search")

const paginationHelper = require("../../helpers/pagination")



// [GET]   /admin/products
module.exports.index = async (req, res) => { 
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if(req.query.status){
        find.status = req.query.status 
    }

    //tìm kiếm
    const objextSearch = searchHelper(req.query);
    
    if(objextSearch.regex) {
        find.title = objextSearch.regex;
    }

    //phân trang (pagination)
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            curentPage: 1,
            limitItem: 4
        },
            req.query,
            countProducts
    )

    //

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objextSearch.keyword,
        pagination: objectPagination
    });
}