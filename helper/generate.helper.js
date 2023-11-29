module.exports.generateRandomString = (length) => {
  let result = "";
  const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += character[Math.floor(Math.random() * character.length)];
  }
  return result;
}

module.exports.generateRandomNumber = (length) => {
  let result = "";
  const character = "0123456789";
  for (var i = 0; i < length; i++) {
    result += character[Math.floor(Math.random() * character.length)];
  }
  return result;
}