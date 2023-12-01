const SettingGeneral = require('../../models/settingGeneral.model');

module.exports.edit = async (req, res) => {
  try {
    await SettingGeneral.updateOne({}, req.body);
    const data = await SettingGeneral.findOne({});
    res.json({
      code: 200,
      message: "Cập nhật cấu hình chung thành công",
      settingGeneral: data
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Cập nhật cấu hình thất bại"
    });
  }
}