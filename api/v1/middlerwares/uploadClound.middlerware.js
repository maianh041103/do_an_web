const uploadImagesToClound = require('../../../helper/uploadImagesToClound.helper');

module.exports.uploadSingle = async (req, res, next) => {
    if (req.file) {
        const link = await uploadImagesToClound(req.file.buffer);
        req.body[req.file.fieldname] = link;
    }
    next();
}

module.exports.uploadFields = async (req, res, next) => {
  try {
    for (const key in req['files']) {
      req.body[key] = [];
      for (let item of req['files'][key]) {
        const tmp = await uploadToCloudinary(item.buffer);
        req.body[key].push(tmp);
      }
    }
  } catch (error) {
    console.log(error);
  }
  next();
};