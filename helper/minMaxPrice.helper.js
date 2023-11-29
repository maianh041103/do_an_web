module.exports = (products, minPrice, maxPrice) => {

  const newProducts = products.filter(item => {
    if (item.group.length > 0) {
      let check = false;
      item.group.forEach(childItem => {
        if (childItem.price >= minPrice && childItem.price <= maxPrice) {
          check = true;
        }
      });
      if (check === true) {
        return item;
      }
    } else {
      if (item.price >= minPrice && item.price <= maxPrice) {
        return item;
      }
    }
  });
  return newProducts;
}