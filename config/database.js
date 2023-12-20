const mongoose = require('mongoose');

module.exports.connect = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGOOSE);
    console.log("Connect success " + process.env.MONGOOSE);
  } catch (error) {
    console.log("Connect error");
  }
}