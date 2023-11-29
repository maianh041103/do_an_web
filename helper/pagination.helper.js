module.exports = (objectPagination, query, countItem) => {
  if (query.page) {
    if (query.page > countItem) {
      objectPagination.currentPage = countItem;
    }
    else if (query.page < 1) {
      objectPagination.currentPage = 1;
    }
    else {
      objectPagination.currentPage = parseInt(query.page);
    }
  }
  if (query.limit) {
    objectPagination.limit = parseInt(query.limit);
  }
  const totalPage = Math.ceil(countItem / objectPagination.limit);
  objectPagination.totalPage = totalPage;
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limit;
  return objectPagination;
}