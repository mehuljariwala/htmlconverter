import { toJpeg } from "html-to-image";

/* This is another way to do it, also in C.
 ** It is easier to do in editors that do not automatically indent the second
 ** through last lines of the comment one space from the first.
 ** It is also used in Holub's book, in rule 31.
 */

const getOptions = (options) => {
  const defaultOptions = {
    quality: (options && options.quality) || 1,
    compressQuality: (options && options.compressQuality) || 0.02,
    finalSize: (options && options.finalSize) || 4194304,
    imageType: (options && options.imageType) || "image/png",
    pixelRatio: (options && options.pixelRatio) || 1,
  };
  return defaultOptions;
};

/**
 *
 * @param { This is base64 URL } dataUrl
 * @param { Type of image png jpeg etc } imageType
 */
const getBlobURL = (dataUrl, imageType) => {
  return new Promise((resolve) => {
    const binaryString = window.atob(dataUrl.split(",")[1]);
    const len = binaryString.length;
    const binaryArray = new Uint8Array(len);

    for (let i = 0; i < len; i += 1) {
      binaryArray[i] = binaryString.charCodeAt(i);
    }
    resolve(new Blob([binaryArray], { type: imageType }));
  });
};

/**
 *
 * @param { DOM Element which u want to capture } selector
 * @param { list of options where u can customize the picture } options
 */

const getShareImage = async (selector, options) => {
  let {
    quality,
    compressQuality,
    finalSize,
    imageType,
    pixelRatio,
  } = getOptions(options);
  try {
    return new Promise((resolve) => {
      toJpeg(selector, { quality, pixelRatio })
        .then((dataUrl) => {
          getBlobURL(dataUrl, imageType).then((blob) => {
            //Decrease the quality of image until each reach limit
            if (blob.size > finalSize) {
              quality = quality - compressQuality;
              const updatedOptions = { ...options, quality: quality };
              getShareImage(selector, updatedOptions);
            } else {
              resolve(URL.createObjectURL(blob));
            }
          });
        })
        .catch((err) => console.log("ERROR", err));
    });
  } catch (err) {
    console.log("ERROR", err);
  }
};

export { getShareImage };
