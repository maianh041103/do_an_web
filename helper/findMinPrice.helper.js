module.exports.findMinPrice = (item) => {
  let minPrice = 0;
  if (item.group && item.group.length > 0) {
    item.group.forEach(childItem => {
      if (childItem.priceNew < minPrice) {
        minPrice = childItem.priceNew
      }
    });
  } else {
    minPrice = item.priceNew;
  }
  return minPrice;
}