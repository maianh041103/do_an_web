const SettingGeneral = require('../../models/settingGeneral.model');

module.exports.edit = async (req, res) => {
  try {
    const record = await SettingGeneral.findOne({});
    let data;
    if (!record) {
      data = new SettingGeneral(req.body);
      await data.save();
    }
    await SettingGeneral.updateOne({}, req.body);
    data = await SettingGeneral.findOne({});
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