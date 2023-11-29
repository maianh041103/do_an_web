let countItem = 0;

const createTree = (arr, parentId = "") => {
  const result = [];
  arr.forEach(item => {
    if (item.parentId == parentId) {
      countItem++;
      const newItem = item;
      newItem.index = countItem;
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
  countItem = 0;
  const tree = createTree(arr, parentId);
  return tree;
}