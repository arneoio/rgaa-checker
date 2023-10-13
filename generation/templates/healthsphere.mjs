const formatData = (healthsphere, healthsphereList, healthsphereProductList, catalogData) => {
  return {
    pageTitle: healthsphere.name,
    healthsphere: healthsphere,
    healthsphereList: healthsphereList,
    filters: catalogData.filters,
    catalog: {
      productList: healthsphereProductList,
    },
  };
};

export default {
  formatData,
};
