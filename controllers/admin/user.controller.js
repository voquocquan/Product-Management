const User = require("../../models/user.model")

// [GET]   /admin/users
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await User.find(find).select(" -tokenUser");

  for (const record of records) {
    const user = await User.findOne({
        _id: record.user_id,
        deleted: false
      
    });
    record.user = user;
  }
  
  res.render("admin/pages/users/index.pug", {
    pageTitle: "Danh sách",
    records: records
  });
}

// [GET]   /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  try {
      const find = {
          deleted: false,
          _id: req.params.id
      };

      const user = await User.findOne(find).select("-password -tokenUser");

      res.render("admin/pages/users/detail", {
          pageTitle: user.title,
          user: user
      });
  } catch (error) {
      // req.flash("error", `Không tìm thấy trang!`);
      res.redirect(`${systemConfig.preFixAdmin}/users`);
  }
};

// [DELETE]   /admin/user/delete/:id

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  
  await User.updateOne({ _id: id }, {
      deleted: true,
      // deleteAt: new Date()
      deletedBy: {
          user_id: res.locals.user.id,
          deletedAt: new Date(),
      }
  });
  req.flash("success", `Đã xoá thành công tài khoản!`);
  res.redirect("back");
};