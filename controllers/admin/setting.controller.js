const SettingGeneral = require("../../models/settings-general")

// [GET]   /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  
  res.render("admin/pages/settings/general.pug", {
      pageTitle: "Cài đặt chung",
      settingGeneral: settingGeneral
  });
}

// [PATCH]   /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  if(settingGeneral) {
    await  SettingGeneral.updateOne({
      _id: settingGeneral
    }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  res.redirect("back");
}