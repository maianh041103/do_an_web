const calcPriceNewHelper = require('./calcPriceNew.helper');
module.exports = (products, minPrice, maxPrice) => {
  const newProducts = products.filter(item => {
    item = calcPriceNewHelper.calc(item);
    if (item.group && item.group.length > 0) {
      //console.log(item);
      //console.log("Gia moi : " + item.newGroup.priceNew);
      let check = false;
      item.group.forEach(childItem => {
        if (childItem.priceNew >= minPrice && childItem.priceNew <= maxPrice) {
          check = true;
        }
      });
      if (check === true) {
        return item;
      }
    } else {
      if (item.priceNew >= minPrice && item.priceNew <= maxPrice) {
        return item;
      }
    }
  });
  return newProducts;
}