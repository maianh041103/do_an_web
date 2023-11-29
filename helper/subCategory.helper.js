const subCategory = async (parentId, Category) => {
  const getCategory = await Category.find({
    deleted: false,
    status: "active",
    parentId: parentId
  });

  let result = [...getCategory];
  for (const item of getCategory) {
    result = result.concat(await subCategory(item._id, Category));
  }

  return result;
}

module.exports.subCategory = async (parentId, Category) => {
  const result = await subCategory(parentId, Category);
  return result;
}