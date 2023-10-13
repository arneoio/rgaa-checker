const formatData = (productCategory) => {
  return {
    id: productCategory.id,
    name: productCategory.name,
    productNumber: productCategory.count,
  };
};

export default {
  formatData,
};
