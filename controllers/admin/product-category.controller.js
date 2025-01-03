const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")

const createTreeHelper = require("../../helpers/createTree");
// const { request } = require("express");

// [GET]   /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
    });
}

// [GET]   /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);
    
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords,
    });
}

// [POST]   /admin/products-category/create
module.exports.createPost = async (req, res) => {
    //fix phân quyền bên backend
    // const permissions = res.locals.role.permissions;
    // if (permissions.includes("product-category_create")) {
    //     console.log("Có quyền");
    // } else {
    //     res.send("403");
    //     return;
    // }

    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body)
    await record.save();

    res.redirect(`${systemConfig.preFixAdmin}/products-category`);
};

// [GET]   /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });
        const records = await ProductCategory.find({
            deleted: false,
        });
    
        const newRecords = createTreeHelper.tree(records);
    
        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.preFixAdmin}/products-category`)
    }
}

// [GET]   /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position)

    await ProductCategory.updateOne({_id: id}, req.body)

    res.redirect("back")
}   

// [GET]   /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const productCategory = await ProductCategory.findOne(find);

        res.render("admin/pages/products-category/detail", {
            pageTitle: productCategory.title,
            productCategory: productCategory
        });
    } catch (error) {
        // req.flash("error", `Không tìm thấy trang!`);
        res.redirect(`${systemConfig.preFixAdmin}/products-category`);
    }
};