import Api from '../api.mjs';

const args = process.argv.slice(2);
const applicationType = args[0];

const BUILDER_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}/${applicationType}/${process.env.BUILDER_SUBFOLDER}`;

const formatData = (healthSphere) => {
  const healthsphereImagesFolder = `./${BUILDER_FOLDER}/images/naturactive/healthspheres`;
  const healthsphereImagesPath = `./images/naturactive/healthspheres`;

  let formattedData = {
    id: healthSphere.id,
    slug: healthSphere.slug,
    name: healthSphere.name,
    url: `healthsphere-${healthSphere.slug}.html`,
    description: healthSphere.description,
    productNumber: healthSphere.count,
    rangeNumber: healthSphere.range_count,
  };
  let acf = healthSphere.acf;
  if (acf) {
    if (acf.image_ambiance) {
      downloadImage(acf.image_ambiance.sizes.medium_large, 'ambiance1');
    }
    if (acf.secondary_image) {
      downloadImage(acf.secondary_image.sizes.thumbnail, 'ambiance2');
    }
    if (acf.picto) {
      downloadImage(acf.picto.sizes.thumbnail, 'picto');
    }
  }

  function downloadImage(image, name) {
    let imageExtension = image.split('.').pop();
    let imagePath = `${healthsphereImagesPath}/${healthSphere.slug}/${name}.${imageExtension}`;
    formattedData[name] = {
      src: imagePath,
    };
    Api.downloadImage(image, `${healthsphereImagesFolder}/${healthSphere.slug}/${name}.${imageExtension}`);
  }

  return formattedData;
};

export default {
  formatData,
};
