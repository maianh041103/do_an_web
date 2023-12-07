module.exports.productSold = (product) => {
  if (product.group && product.group.length > 0) {
    const total = product.group.reduce((cal, item) => {
      return cal + (item.quantity - item.stock);
    }, 0)
    return total;
  } else {
    return product.quantity - product.stock;
  }
}