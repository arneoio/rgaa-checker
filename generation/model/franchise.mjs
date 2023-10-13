const formatData = (franchise) => {
  return {
    id: franchise.id,
    name: franchise.name,
    productNumber: franchise.count,
  };
};

export default {
  formatData,
};
