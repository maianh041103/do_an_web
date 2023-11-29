const FeedBack = require('../../models/feedback.model');

module.exports.create = async (req, res) => {
  //Check statusComment trong order
  const feedback = new FeedBack(req.body);
  await feedback.save();
  res.json({
    code: 200,
    message: "Đánh giá thành công"
  })
}