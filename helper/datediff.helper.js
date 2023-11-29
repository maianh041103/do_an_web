module.exports.diff = (time1, time2) => {
  var start = new Date(time1); // Chuyển đổi chuỗi thời gian thành đối tượng Date
  var end = new Date(time2); // Chuyển đổi chuỗi thời gian thành đối tượng Date
  var khoangCach = Math.abs(end - start) / 3600000 / 24; // Chuyển đổi thành ngày
  return khoangCach;
}