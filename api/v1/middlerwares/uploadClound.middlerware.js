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
        const tmp = await uploadImagesToClound(item.buffer);
        console.log(tmp);
        req.body[key].push(tmp);
      }
    }
  } catch (error) {
    console.log(error);
  }
  next();
};

module.exports.uploadArray = async (req, res, next) => {
  try {
    req.body[req['files'][0].fieldname] = [];
    for (let item of req['files']) {
      const tmp = await uploadImagesToClound(item.buffer);
      req.body[item.fieldname].push(tmp);
    }
  } catch (error) {
    console.log(error);
  }
  next();
};