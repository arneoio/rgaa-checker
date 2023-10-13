const formatDataPharmacare = (productList, franchiseList, healthsphereList) => {
  return {
    filters: {
      franchiseList,
      healthsphereList,
    },
    catalog: {
      productList: productList,
    },
  };
};

const formatDataNaturactive = (productList, rangeList, productCategoryList, productTypeList) => {
  return {
    filters: {
      rangeList,
      categoryList: productCategoryList,
      typeList: productTypeList,
    },
    catalog: {
      productList: productList,
    },
  };
};

export default {
  formatDataPharmacare,
  formatDataNaturactive,
};
