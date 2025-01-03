const User = require("../../models/user.model")

// [GET]   /admin/users
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await User.find(find).select(" -tokenUser");
  console.log(records);

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