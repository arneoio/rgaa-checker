const formatData = (productType) => {
  return {
    id: productType.id,
    name: productType.name,
    productNumber: productType.count,
  };
};

export default {
  formatData,
};
