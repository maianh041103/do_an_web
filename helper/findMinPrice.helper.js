module.exports.findMinPrice = (item) => {
  let minPrice = 10000000000000000;
  if (item.newGroup && item.newGroup.length > 0) {
    item.newGroup.forEach(childItem => {
      if (childItem.priceNew < minPrice) {
        minPrice = childItem.priceNew
      }
    });
  } else {
    minPrice = item.priceNew;
  }
  return minPrice;
}