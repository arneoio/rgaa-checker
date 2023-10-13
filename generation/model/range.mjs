const formatData = (range) => {
  return {
    id: range.id,
    name: range.name,
    productNumber: range.count,
  };
};

export default {
  formatData,
};
