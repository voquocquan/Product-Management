const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const Account = require("../../models/account.model")


const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filter-status")

const searchHelper = require("../../helpers/search")

const paginationHelper = require("../../helpers/pagination")

const createTreeHelper = require("../../helpers/createTree");

// [GET]   /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status
    }

    //tìm kiếm
    const objextSearch = searchHelper(req.query);

    if (objextSearch.regex) {
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

    //Sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    //End Sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (const product of products) {
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });

        if(user) {
            product.accountFullName = user.fullName
        }
    };

    
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
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm!`);
            break;

        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm!`);
            break;

        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: "true",
                    // deleteAt: new Date(),
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    }
                },
            );
            req.flash("success", `Đã xoá thành công ${ids.length} sản phẩm!`);
            break;

        case "change-position":

            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                // console.log(id);
                // console.log(position);
                await Product.updateOne({ _id: id }, {
                    position: position
                });
                req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
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
        // deleteAt: new Date()
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        }
    });
    req.flash("success", `Đã xoá thành công sản phẩm!`);
    res.redirect("back");
};


// [GET]   /admin/products/create
module.exports.create = async (req, res) => {
    
    let find = {
        deleted: false,
    };

    const category = await ProductCategory.find(find)

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    });
};

// [POST]   /admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy  = {
        account_id: res.locals.user.id
    };

    const product = new Product(req.body)
    await product.save();

    res.redirect(`${systemConfig.preFixAdmin}/products`);
};

// [GET]   /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        const category = await ProductCategory.find({
            deleted: false,
        })

        const newCategory = createTreeHelper.tree(category);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    } catch (error) {
        // req.flash("error", `Không tìm thấy trang!`);
        res.redirect(`${systemConfig.preFixAdmin}/products`);
    }

};


// [PATCH]   /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({ _id: id }, req.body );
        req.flash("success", `Cập nhật thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật thất bại!`);
    };

    res.redirect("back");
};


// [GET]   /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        // req.flash("error", `Không tìm thấy trang!`);
        res.redirect(`${systemConfig.preFixAdmin}/products`);
    }
};
