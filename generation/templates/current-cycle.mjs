import Api from '../api.mjs';

const args = process.argv.slice(2);
const applicationType = args[0];

const BUILDER_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}/${applicationType}/${process.env.BUILDER_SUBFOLDER}`;

const formatDataPharmacare = (rawData, rangeList, productList, healthsphereList) => {
  if (!rawData.current_cycle) {
    return;
  }
  let cycle = rawData.current_cycle.acf;
  const cycleImageFolder = `./${BUILDER_FOLDER}/images/cycle`;
  const cycleImagePath = `./images/cycle`;
  let heroImagePath = '';

  // Download highlight product image
  let hero = {};
  if (cycle && cycle.highlighted_product && cycle.highlighted_product_image) {
    const imageUrl = cycle.highlighted_product_image.url;
    const imageExtension = imageUrl.split('.').pop();

    Api.downloadImage(imageUrl, `${cycleImageFolder}/highlight.${imageExtension}`);
    heroImagePath = `${cycleImagePath}/highlight.${imageExtension}`;

    hero = {
      href: `product-${cycle.highlighted_product.post_name}.html`,
      image: {
        src: heroImagePath,
      },
    };
  }

  let pharmacareCards = {
    cardList: [],
  };

  // Loop on range list
  [...cycle.products].forEach((pharmacareCard, index) => {
    if (!pharmacareCard.ranges) {
      console.log('No range for this product', pharmacareCard);
      return;
    }

    let rangeId = pharmacareCard.ranges[0];
    let title = rangeList.find((range) => range.id === rangeId).name;

    const imageUrl = pharmacareCard.range_image.url;
    const imageExtension = imageUrl.split('.').pop();
    // Download block image
    Api.downloadImage(imageUrl, `${cycleImageFolder}/range-${index}.${imageExtension}`);
    let rangeImagePath = `${cycleImagePath}/range-${index}.${imageExtension}`;

    // Set product list, separated by type
    let typeList = {};
    [...pharmacareCard.products].forEach((highlightProduct) => {
      let selectedProduct = productList.find((product) => product.id === highlightProduct.ID);
      if (!typeList.hasOwnProperty(selectedProduct.type)) {
        typeList[selectedProduct.type] = [];
      }
      typeList[selectedProduct.type].push(selectedProduct);
    });

    pharmacareCards.cardList.push({
      title,
      image: {
        src: rangeImagePath,
      },
      typeList,
    });
  });

  // Build naturactive product list
  let naturactiveRangeList = [];
  [...rawData.products].forEach((productCategory) => {
    const healthsphereItem = healthsphereList.find((healthsphere) => healthsphere.id === productCategory.healthspheres);
    let name = healthsphereItem?.name || '';

    let naturactiveProductList = [];
    if (productCategory.products) {
      [...productCategory.products].forEach((naturactiveProduct) => {
        naturactiveProductList.push(productList.find((product) => product.id === naturactiveProduct.ID));
      });
    }

    naturactiveRangeList.push({
      name,
      productList: naturactiveProductList,
    });
  });

  let naturactive = {
    title: rawData.text,
    rangeList: naturactiveRangeList,
  };

  return {
    pharmacareCards,
    naturactive,
  };
};

const formatDataNaturactive = (rawData, catalogData) => {
  if (!rawData.current_cycle) {
    return;
  }
  let cycle = rawData.current_cycle.acf;
  const cycleImageFolder = `./${BUILDER_FOLDER}/images/cycle`;
  const cycleImagePath = `./images/cycle`;
  let heroImagePath = '';

  // Download highlight product image
  let activation = {};
  let cycleProductList = [];
  if (cycle) {
    if (cycle.highlighted_product_image && cycle.highlighted_product) {
      const imageUrl = cycle.highlighted_product_image.url;
      const imageExtension = imageUrl.split('.').pop();

      Api.downloadImage(imageUrl, `${cycleImageFolder}/activation.${imageExtension}`);
      heroImagePath = `${cycleImagePath}/activation.${imageExtension}`;

      activation = {
        href: `product-${cycle.highlighted_product.post_name}.html`,
        image: {
          src: heroImagePath,
        },
      };
    }
    if (cycle.products) {
      let catalogProductList = catalogData.catalog.productList;
      // Loop on catalog product list and replace them by cycle prodcuts only
      cycle.products.forEach((cycleProduct) => {
        let product = catalogProductList.find((product) => product.id === cycleProduct.ID);
        cycleProductList.push(product);
      });
    }
  }

  return {
    activation: activation,
    catalog: { productList: cycleProductList },
    filters: catalogData.filters,
  };
};

export default {
  formatDataPharmacare,
  formatDataNaturactive,
};
