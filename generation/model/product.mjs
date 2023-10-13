import Api from '../api.mjs';
import * as fs from 'fs';

const args = process.argv.slice(2);
const applicationType = args[0];

const BUILDER_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}/${applicationType}/${process.env.BUILDER_SUBFOLDER}`;

const formatData = (rawData, formattedData, applicationType) => {
  const productImagesFolder = `./${BUILDER_FOLDER}/images/products`;
  const productImagesPath = `./images/products`;
  const productUpdateDate = new Date(rawData.modified).getTime();

  // Get product franchise
  let productFranchise = formattedData['franchiseList']
    .filter((franchise) => rawData.franchise.includes(franchise.id))
    .shift();
  // Get product healthsphere
  let productHealthsphere = formattedData['healthsphereList']
    .filter((healthsphere) => rawData.healthsphere.includes(healthsphere.id))
    .shift();
  let productRange = formattedData['rangeList'].filter((range) => rawData.range.includes(range.id)).shift();
  let productCategoryList = formattedData['productCategoryList'].filter((productCategory) =>
    rawData.product_category.includes(productCategory.id),
  );
  let productTypeList = formattedData['productTypeList'].filter((productType) =>
    rawData.product_type.includes(productType.id),
  );

  // Loads slider images from product, market and animation
  let setSlides = (rawSlideList, type) => {
    let sectionSlideList = [];
    // Subtilité supplémentaire, les champs ont des champs image préfixés de leur type, sauf pour les produits de type naturactive
    let imageField = type === 'naturactive' ? 'image' : `${type}_image`;
    let isZoomableField = type === 'naturactive' ? 'is_zoomable' : `dm_image_is_zoomable`;
    let isVideoField = type === 'naturactive' ? 'is_video' : `dm_image_is_video`;

    rawSlideList.forEach((slide) => {
      if (slide[imageField]) {
        let imageExtension = slide[imageField].url.split('.').pop();

        let imageFilename = `${productImagesFolder}/${rawData.slug}/slide-${slideIndex}.${imageExtension}`;
        if (!fs.existsSync(imageFilename)) {
          Api.downloadImage(slide[imageField].url, imageFilename);
        } else {
          // Download image if file doesn't exist or is older than product update date
          let imageModified = fs.statSync(imageFilename).mtime;
          let imageModifiedTime = new Date(imageModified).getTime();

          if (imageModifiedTime < productUpdateDate) {
            Api.downloadImage(slide[imageField].url, imageFilename);
          }
        }

        // Download zoom image if needed
        let zoomImageExtension;
        if (slide[isZoomableField]) {
          if (slide['zoom_image']) {
            zoomImageExtension = slide['zoom_image'].url.split('.').pop();
            let zoomImageFilename = `${productImagesFolder}/${rawData.slug}/slide-${slideIndex}-zoom.${zoomImageExtension}`;
            if (!fs.existsSync(zoomImageFilename)) {
              Api.downloadImage(slide['zoom_image'].url, zoomImageFilename);
            } else {
              // Download image if file doesn't exist or is older than product update date
              let zoomImageModified = fs.statSync(zoomImageFilename).mtime;
              let zoomImageModifiedTime = new Date(zoomImageModified).getTime();

              if (zoomImageModifiedTime < productUpdateDate) {
                Api.downloadImage(slide['zoom_image'].url, zoomImageFilename);
              }
            }
          }
        }

        let videoExtension;
        if (slide[isVideoField]) {
          if (slide['video']) {
            videoExtension = slide['video'].split('.').pop();
            let videoFilename = `${productImagesFolder}/${rawData.slug}/slide-${slideIndex}-video.${videoExtension}`;
            if (!fs.existsSync(videoFilename)) {
              Api.downloadImage(slide['video'], videoFilename);
            } else {
              // Download image if file doesn't exist or is older than product update date
              let videoModified = fs.statSync(videoFilename).mtime;
              let videoModifiedTime = new Date(videoModified).getTime();

              if (videoModifiedTime < productUpdateDate) {
                Api.downloadImage(slide['video'], videoFilename);
              }
            }
          }
        }

        sectionSlideList.push({
          title: slide.dm_title || '',
          image: {
            src: `${productImagesPath}/${rawData.slug}/slide-${slideIndex}.${imageExtension}`,
          },
          isZoomable: slide[isZoomableField],
          isVideo: slide[isVideoField],
          zoomImage: {
            src: slide[isZoomableField]
              ? `${productImagesPath}/${rawData.slug}/slide-${slideIndex}-zoom.${zoomImageExtension}`
              : `${productImagesPath}/${rawData.slug}/slide-${slideIndex}.${imageExtension}`,
          },
          video: {
            src: slide[isVideoField]
              ? `${productImagesPath}/${rawData.slug}/slide-${slideIndex}-video.${videoExtension}`
              : '',
          },
        });

        ++slideIndex;
      }
    });

    return sectionSlideList;
  };

  // Groupe les slides par section
  let slideIndex = 0;
  let slideList = {};
  // Alors ici on est sur un beau bordel...
  // Dans le BO, le nom des champs diffère suivant dm/pharmacare et naturactive
  let type = rawData.acf.type;
  let fieldPrefix = 'dm'; // Pour l'application Pharmacare, le type est "dm" quel que soit le type de produit (pharmacare, naturactive ou cosmetique)
  if (type === 'amm') {
    // Sauf pour les produits amm qui ont leur type
    fieldPrefix = 'amm';
  } else if (applicationType === 'naturactive') {
    // Sur naturactive, cosmetique et pharmacare sont dm, mais les produits naturactive ou amm ou leur type différent
    fieldPrefix = ['cosmetique', 'pharmacare'].indexOf(type) >= 0 ? 'dm' : type;
  }

  let typeLabelList = {
    amm: 'Médicament',
    cosmetique: 'Cosmétique',
    dm: 'Dispositif médical',
    alimentaire: 'Aliment',
  };

  let typeLabel = typeLabelList[type] || type;

  if (rawData.acf[`${fieldPrefix}_images`]) {
    let slideSectionName = 'product';
    slideList[slideSectionName] = setSlides(rawData.acf[`${fieldPrefix}_images`], fieldPrefix);
  }
  if (rawData.acf[`${fieldPrefix}_market_images`]) {
    let slideSectionName = 'market';
    slideList[slideSectionName] = setSlides(rawData.acf[`${fieldPrefix}_market_images`], fieldPrefix);
  }
  if (rawData.acf[`${fieldPrefix}_benefits_images`]) {
    let slideSectionName = 'benefits';
    slideList[slideSectionName] = setSlides(rawData.acf[`${fieldPrefix}_benefits_images`], fieldPrefix);
  }
  if (rawData.acf[`${fieldPrefix}_animation_images`]) {
    let slideSectionName = 'animation';
    slideList[slideSectionName] = setSlides(rawData.acf[`${fieldPrefix}_animation_images`], fieldPrefix);
  }
  if (rawData.acf[`${fieldPrefix}_clinical_studies_images`]) {
    let slideSectionName = 'clinical_studies';
    slideList[slideSectionName] = setSlides(rawData.acf[`${fieldPrefix}_clinical_studies_images`], fieldPrefix);
  }
  if (rawData.acf[`marketing_support_images`]) {
    let slideSectionName = 'marketing_support';
    // Pas de préfixe dans le champs ici, du coup on considère qu'on est en type naturactive...
    slideList[slideSectionName] = setSlides(rawData.acf[`marketing_support_images`], 'naturactive');
  }
  if (rawData.acf[`${fieldPrefix}_mentions_images`]) {
    let slideSectionName = 'mentions';
    slideList[slideSectionName] = setSlides(rawData.acf[`${fieldPrefix}_mentions_images`], fieldPrefix);
  }

  // Set keywords
  let keywordList = [];
  if (rawData.acf.keywords) {
    rawData.acf.keywords.forEach((keyword) => {
      keywordList.push(keyword.keyword);
    });
  }

  let productData = {
    id: rawData.id,
    name: rawData.title.rendered,
    slug: rawData.slug,
    isBio: rawData.acf.is_bio,
    url: `product-${rawData.slug}.html`,
    href: `product-${rawData.slug}.html`,
    type: rawData.acf.type,
    typeLabel: typeLabel,
    image: {
      src: `${productImagesPath}/${rawData.slug}/product.png`,
    },
    franchise: productFranchise && {
      id: productFranchise.id,
      name: productFranchise.name,
    },
    healthsphere: productHealthsphere && {
      id: productHealthsphere.id,
      name: productHealthsphere.name,
      picto: productHealthsphere.picto,
    },
    range: productRange && {
      id: productRange.id,
      name: productRange.name,
    },
    typeList: [
      ...productTypeList.map((productType) => {
        return {
          id: productType.id,
          name: productType.name,
        };
      }),
    ],
    categoryList: [
      ...productCategoryList.map((productCategory) => {
        return {
          id: productCategory.id,
          name: productCategory.name,
        };
      }),
    ],
    favorite: false,
    linkDetails: 'VOIR LA FICHE PRODUIT',
    slideList,
    keywordList,
  };

  // Download image if file doesn't exist or is older than product update date
  let imageFilename = `${productImagesFolder}/${rawData.slug}/product.png`;
  if (!fs.existsSync(imageFilename)) {
    Api.loadProductImages(applicationType, rawData, productData, imageFilename);
  } else {
    // Download image if file doesn't exist or is older than product update date
    let imageModified = fs.statSync(imageFilename).mtime;
    let imageModifiedTime = new Date(imageModified).getTime();

    if (imageModifiedTime < productUpdateDate) {
      Api.loadProductImages(applicationType, rawData, productData, imageFilename);
    }
  }

  return productData;
};

export default {
  formatData,
};
