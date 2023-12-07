module.exports.calc = (product) => {
  if (!product.discountPercent)
    product.discountPercent = 0;

  let newGroup = [];
  if (product.group) {
    if (product.group.length === 0) {
      product.priceNew = parseFloat((product.price * (100 - product.discountPercent) / 100).toFixed(0));
    }
    else {
      for (let item of product.group) {
        let groupChild = {
          childTitle: item.childTitle,
          price: item.price,
          quantity: item.quantity,
          stock: item.stock
        };
        groupChild.priceNew = parseFloat((item.price * (100 - product.discountPercent) / 100).toFixed(0));
        newGroup.push(groupChild);
      }
      product.newGroup = newGroup;
    }
  } else {
    product.priceNew = parseFloat((product.price * (100 - product.discountPercent) / 100).toFixed(0));
  }
  return product;
}