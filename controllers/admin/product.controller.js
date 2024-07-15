
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

    const products = await Product.find(find)
        .sort({ position: "desc"})
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objextSearch.keyword,
        pagination: objectPagination
    });
}


// [PATCH]   /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");

    //chuyển hướng trang
    res.redirect("back");
};


// [PATCH]   /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids}},
                { status: "active"}
            );
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm!`);
            break;

        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids}},
                { status: "inactive"}
            );
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm!`);
            break;
    
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids}},
                { 
                    deleted: "true",
                    deleteAt: new Date(),
                },
            );
            break;

        case "change-position":
            
            for (const item of ids) {
                let [id, position ] = item.split("-");
                position = parseInt(position);

                // console.log(id);
                // console.log(position);
                await Product.updateOne({ _id: id }, { 
                    position: position 
                });
            }
            break;

        default:
            break;
    }

    res.redirect("back");
};


// [DELETE]   /admin/products/delete/:id

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    // await Product.deleteOne({ _id: id });  //xoá cứng

    //xoá mềm
    await Product.updateOne({ _id: id }, {      
        deleted: true,
        deleteAt: new Date()
    });
    
    res.redirect("back");
};