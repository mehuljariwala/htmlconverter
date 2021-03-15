import { toJpeg } from "html-to-image";

const getBlobURL = (url, imageType) => {
  return new Promise((resolve) => {
    const binaryString = window.atob(url.split(",")[1]);
    const len = binaryString.length;
    const binaryArray = new Uint8Array(len);

    for (let i = 0; i < len; i += 1) {
      binaryArray[i] = binaryString.charCodeAt(i);
    }
    resolve(new Blob([binaryArray], { type: imageType }));
  });
};

const getShareImage = (selector, options) => {
  let { imageQuality, compressQuality, finalSize, imageType } = options;
  const libraryOptions = { quality: imageQuality, pixelRatio: 1 };
  return new Promise((resolve) => {
    toJpeg(selector, libraryOptions)
      .then((dataUrl) => {
        getBlobURL(dataUrl, imageType).then((blob) => {
          if (blob.size > finalSize) {
            imageQuality = imageQuality - compressQuality;
            getShareImage(selector, { ...options, imageQuality: imageQuality });
          } else {
            resolve(URL.createObjectURL(blob));
          }
        });
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  }).catch((err) => {
    console.log("ERROR", err);
  });
};

export { getShareImage };
