const SettingGeneral = require('../../models/settingGeneral.model');

//[GET] /api/v1/general/setting
module.exports.setting = async (req, res) => {
  const generalSetting = await SettingGeneral.findOne({});

  res.json({
    setting: generalSetting
  });
}