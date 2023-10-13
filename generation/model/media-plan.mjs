import Api from '../api.mjs';
import * as fs from 'fs';

const args = process.argv.slice(2);
const applicationType = args[0];

const BUILDER_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}/${applicationType}/${process.env.BUILDER_SUBFOLDER}`;

const formatData = (mediaPlan) => {
  if (!mediaPlan.plan_medias) {
    return {};
  }

  const mediaPlanImagesFolder = `./${BUILDER_FOLDER}/images/media-plan`;
  const mediaPlanImagesPath = `./images/media-plan`;

  let imageField = 'plan_media_image';
  let isZoomableField = 'plan_media_image_is_zoomable';
  let isVideoField = 'plan_media_image_is_video';
  let slideList = {};

  mediaPlan.plan_medias.forEach((media, slideIndex) => {
    if (media[imageField]) {
      let slideSectionName = media.plan_media_title;

      let imageExtension = media[imageField].url.split('.').pop();
      let imageFilename = `${mediaPlanImagesFolder}/slide-${slideIndex}.${imageExtension}`;
      Api.downloadImage(media[imageField].url, imageFilename);

      // Download zoom image if needed
      let zoomImageExtension;
      if (media[isZoomableField] && media['zoom_image']) {
        zoomImageExtension = media['zoom_image'].url.split('.').pop();
        let zoomImageFilename = `${mediaPlanImagesFolder}/slide-${slideIndex}-zoom.${zoomImageExtension}`;
        Api.downloadImage(media['zoom_image'].url, zoomImageFilename);
      }

      let videoExtension;
      if (media[isVideoField] && media['video']) {
        videoExtension = media['video'].split('.').pop();
        let videoFilename = `${mediaPlanImagesFolder}/slide-${slideIndex}-video.${videoExtension}`;
        Api.downloadImage(media['video'], videoFilename);
      }

      if (!slideList[slideSectionName]) {
        slideList[slideSectionName] = [];
      }

      slideList[slideSectionName].push({
        title: media.plan_media_title || '',
        image: {
          src: `${mediaPlanImagesPath}/slide-${slideIndex}.${imageExtension}`,
        },
        isZoomable: media[isZoomableField],
        isVideo: media[isVideoField],
        zoomImage: {
          src: media[isZoomableField]
            ? `${mediaPlanImagesPath}/slide-${slideIndex}-zoom.${zoomImageExtension}`
            : `${mediaPlanImagesPath}/slide-${slideIndex}.${imageExtension}`,
        },
        video: {
          src: media[isVideoField] ? `${mediaPlanImagesPath}/slide-${slideIndex}-video.${videoExtension}` : '',
        },
      });
    }
  });

  let mediaPlanData = {
    slideList,
  };

  return mediaPlanData;
};

export default {
  formatData,
};
