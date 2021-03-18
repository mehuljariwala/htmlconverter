import "./App.css";
import testImage from "./1231.jpeg";
import { getShareImage } from "./helper";

export default function App() {
  const handleImage = async () => {
    const selector = document.getElementById("test-demo");
    let blobURL = await getShareImage(selector);
    console.log(blobURL);
  };

  return (
    <div className="App">
      <div>
        <div
          id="test-demo"
          style={{
            backgroundColor: "#FFFFFF",
          }}
        >
          <h1 onClick={handleImage}>Hello User</h1>
          <h2>Take a screenshot please !</h2>
          <img style={{ width: "100%" }} src={testImage} alt="i" />
          <img style={{ width: "100%" }} src={testImage} alt="i" />
          <img style={{ width: "100%" }} src={testImage} alt="i" />

          <img style={{ width: "100%" }} src={testImage} alt="i" />
        </div>
      </div>
    </div>
  );
}

// import { toJpeg } from "html-to-image";

// /* This is another way to do it, also in C.
//  ** It is easier to do in editors that do not automatically indent the second
//  ** through last lines of the comment one space from the first.
//  ** It is also used in Holub's book, in rule 31.
//  */

// const getOptions = (options) => {
//   const defaultOptions = {
//     imageQuality: options.imageQuality || 1,
//     compressQuality: options.compressQuality || 0.02,
//     finalSize: options.finalSize || 4194304,
//     imageType: options.imageType || "image/png",
//     pixelRatio: options.pixelRatio || 1,
//   };
//   return defaultOptions;
// };

// const JPEG_OPTIONS = { pixelRatio: 1 };

// const getShareImage = async (selector, options) => {
//   let { imageQuality, compressQuality, finalSize, imageType } = getOptions(
//     options
//   );
//   const libraryOptions = {
//     quality: imageQuality,
//     pixelRatio: JPEG_OPTIONS.pixelRatio,
//   };
//   try {
//     return new Promise((resolve) => {
//       toJpeg(selector, {quality,pixelRatio})
//         .then((dataUrl) => {
//           getBlobURL(dataUrl, imageType).then((blob) => {
//             console.log("blob", blob, imageQuality, blob.size);
//             if (blob.size > finalSize) {
//               imageQuality = imageQuality - compressQuality;
//               getShareImage(selector, {
//                 ...options,
//                 imageQuality: imageQuality,
//               });
//             } else {
//               resolve(URL.createObjectURL(blob));
//             }
//           });
//         })
//         .catch((err) => {
//           console.log("ERROR", err);
//         });
//     });
//   } catch (err) {
//     console.log("ERROR", err);
//   }
// };

// const getBlobURL = (dataUrl, imageType) => {
//   return new Promise((resolve) => {
//     const binaryString = window.atob(dataUrl.split(",")[1]);
//     const len = binaryString.length;
//     const binaryArray = new Uint8Array(len);

//     for (let i = 0; i < len; i += 1) {
//       binaryArray[i] = binaryString.charCodeAt(i);
//     }
//     resolve(new Blob([binaryArray], { type: imageType }));
//   });
// };

// export { getTest };
