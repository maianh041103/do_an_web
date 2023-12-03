module.exports.calc = (order) => {
  let totalPrice = 0;
  for (const product of order.products) {
    if (!product.discountPercent) {
      product.discountPercent = 0;
    }
    totalPrice += parseFloat((product.price * (100 - product.discountPercent) / 100).toFixed(0)) * product.quantity;
  }
  return totalPrice;
}