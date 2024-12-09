const Role = require ("../../models/role.model")
const systemConfig = require("../../config/system")

// [GET]   /admin/roles
module.exports.index = async (req, res) => { 
    let find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    });
}

// [GET]   /admin/roles/create
module.exports.create = async (req, res) => { 
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền",
    });
}

// [POST]   /admin/roles/create
module.exports.createPost = async (req, res) => { 
    const record = new Role(req.body);
    await record.save();
    
    res.redirect(`${systemConfig.preFixAdmin}/roles`);
}

// [GET]   /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            _id: id,
            deleted: false
        }

        const data = await Role.findOne(find);
        console.log(data.id);
        
        res.render("admin/pages/roles/edit.pug", {
            pageTitle: "Sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.preFixAdmin}/roles`)
    }
};

// [PATCH]   /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({_id: id}, req.body);

        req.flash("success", "Cập nhật thành công");

    } catch (error) {
        req.flash("success", "Cập nhật thất bại");
    }
    res.redirect("back");
};

// [GET]   /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const data = await Role.findOne(find);

        res.render("admin/pages/roles/detail", {
            
            pageTitle: data.title,
            data: data
        });
    } catch (error) {
        // req.flash("error", `Không tìm thấy trang!`);
        res.redirect(`${systemConfig.preFixAdmin}/roles`);
    }
};
