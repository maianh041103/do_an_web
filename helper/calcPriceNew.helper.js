module.exports.calc = (product) => {
  if (!product.discountPercent)
    product.discountPercent = 0;

  if (product.group) {
    if (product.group.length === 0) {
      product.priceNew = parseFloat((product.price * (100 - product.discountPercent) / 100).toFixed(0));
    }
    else {
      for (const item of product.group) {
        item.priceNew = parseFloat((item.price * (100 - product.discountPercent) / 100).toFixed(0));
      }
    }
  } else {
    product.priceNew = parseFloat((product.price * (100 - product.discountPercent) / 100).toFixed(0));
  }
  return product;
}