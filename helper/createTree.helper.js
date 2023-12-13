const createTree = (arr, parentId = "") => {
  const result = [];
  arr.forEach(item => {
    if (item.parentId == parentId) {
      const newItem = item;
      const childItems = createTree(arr, item.id);
      if (childItems.length > 0) {
        newItem.children = childItems;
      }
      result.push(newItem);
    }
  });
  return result;
}

module.exports.createTree = (arr, parentId = "") => {
  const tree = createTree(arr, parentId);
  return tree;
}