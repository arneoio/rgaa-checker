import dotenv from 'dotenv';
import https from 'https';
import * as fs from 'fs';
import { Transform } from 'stream';
dotenv.config();

// Set host where load data (from .env)
const HOST = process.env.PROJECT_URL;
const PORT = 443;
const API_PATH = `?rest_route=`;

// Load generic data (range, healthsphere, franchise)
const loadData = (applicationType, type) => {
  const path = `/wp/v2/${type}&per_page=100`;
  console.log(`Loading ${type} data from API`);
  return callApi(applicationType, path);
};

// Load all products from API. Max per page is 100, but we have less products
const loadProducts = (applicationType) => {
  console.log(`Loading product data from API`);
  return callApi(applicationType, '/wp/v2/product&per_page=100');
};

// Load current cycle
const loadCurrentCycle = (applicationType) => {
  console.log(`Loading current cycle data from API`);
  return callApi(applicationType, '/eadv/v1/cycle');
};

// Load media plan
const loadMediaPlan = (applicationType) => {
  console.log(`Loading media plan data from API`);
  return callApi(applicationType, '/eadv/v1/plan-media');
};

// Generic function to load data from API
const callApi = (applicationType, path) => {
  return new Promise((resolve, reject) => {
    https
      .get(
        {
          host: HOST,
          port: PORT,
          path: `${applicationType === 'naturactive' ? `/${applicationType}` : ''}${API_PATH}${path}`,
        },
        (res) => {
          let body = '';

          res.on('data', (chunk) => {
            body += chunk;
          });

          res.on('end', () => {
            try {
              try {
                let parsedJson = JSON.parse(body);
                resolve(parsedJson);
              } catch (error) {
                reject(error);
              }
            } catch (error) {
              reject(error);
            }
          });
        },
      )
      .on('error', (error) => {
        console.log('Cannot load data from API', error), reject(error);
      });
  });
};

const loadProductImages = (applicationType, rawData, product, destination) => {
  if (rawData.featured_media) {
    // Create product image folder and download medias if needed
    console.warn(`Uploads product images for ${product.name}`);

    callApi(applicationType, `/wp/v2/media/${rawData.featured_media}`).then(
      (mediaData) => {
        if (mediaData.media_details) {
          try {
            // Get "product-card" image or full image if not found
            let mediaImage = mediaData.media_details.sizes['product-card']
              ? mediaData.media_details.sizes['product-card']
              : mediaData.media_details.sizes.full;
            downloadImage(mediaImage.source_url, destination);
          } catch (error) {
            console.log(`Cannot download image ${destination}`, error);
            console.log(mediaData.media_details.sizes);
          }
        }
      },
      (error) => {
        console.error(`Cannot upload image`, error);
      },
    );
  }
};

/**
 * downloadImage
 *
 * @param   {string}  url
 * @param   {string}  filename
 */
const downloadImage = (url, filename) => {
  if (url && filename) {
    try {
      https
        .request(url, (response) => {
          const data = new Transform();

          response.on('data', (chunk) => {
            data.push(chunk);
          });

          response.on('end', () => {
            // Create folder if needed
            const destinationFolder = filename.substring(0, filename.lastIndexOf('/'));
            fs.mkdirSync(destinationFolder, { recursive: true }, (error) => {
              console.error('Cannot create folder : ', destinationFolder, error);
            });
            // Download image in destination folder
            fs.writeFileSync(filename, data.read());
          });
        })
        .end();
    } catch (error) {
      console.error(`Cannot upload ${filename}`, error);
    }
  }
};

export default {
  loadData,
  loadProducts,
  loadCurrentCycle,
  loadMediaPlan,
  loadProductImages,
  downloadImage,
};
