import Api from '../api.mjs';

const args = process.argv.slice(2);
const applicationType = args[0];

const BUILDER_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}/${applicationType}/${process.env.BUILDER_SUBFOLDER}`;

const formatData = (rawData, rangeList, productList, healthsphereList) => {
  if (!rawData.current_newproducts) {
    return;
  }
  let newProducts = rawData.current_newproducts.acf.products;
  const cycleImageFolder = `./${BUILDER_FOLDER}/images/naturactive/new-products`;
  const cycleImagePath = `./images/naturactive/new-products`;

  let newProductList = [];
  let highlightImagePath = '';

  // Download highlight product image
  newProducts.forEach((newProduct, index) => {
    if (newProduct.featured_image) {
      const imageUrl = newProduct.featured_image.url;
      const imageExtension = imageUrl.split('.').pop();

      Api.downloadImage(imageUrl, `${cycleImageFolder}/highlight-${index}.${imageExtension}`);
      highlightImagePath = `${cycleImagePath}/highlight-${index}.${imageExtension}`;
    }

    // Récupère les infos de la gamme à partir de l'id de la gamme
    let range = rangeList.find((range) => range.id === newProduct.range);

    // Récupère la liste des produits formattées à partir de leur id
    let newProductProductList = [];
    if (newProduct.products) {
      newProductProductList = newProduct.products
      .map((newProduct) => {
        return productList.find((product) => product.id === newProduct.ID);
      })
      .filter((product) => product);
    }
    newProductList.push({
      range: range,
      description: newProduct.description,
      productList: newProductProductList,
      image: {
        src: highlightImagePath,
      },
    });
  });

  return {
    newProductList: newProductList,
  };
};

export default {
  formatData,
};
