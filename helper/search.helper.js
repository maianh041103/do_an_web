module.exports = (query) => {
  const objectSearch = {
    keyword: ""
  }
  if (query.search) {
    objectSearch.keyword = query.search;
    objectSearch.regex = new RegExp(objectSearch.keyword, "i");
  }
  return objectSearch;
}