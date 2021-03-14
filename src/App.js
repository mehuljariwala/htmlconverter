import "./App.css";
import { toJpeg } from "html-to-image";
import testImage from "./1231.jpeg";

export default function App() {
  const toBlob = (dataUrl, imageType = "image/jpeg") => {
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

  const getShareImage = (selector, options) => {
    return new Promise((resolve) => {
      let { imageQuality, imageType, finalSize, compressQuality } = options;
      toJpeg(selector, { quality: imageQuality }).then((dataUrl) => {
        toBlob(dataUrl, imageType).then((blob) => {
          if (blob.size > finalSize) {
            imageQuality = imageQuality - compressQuality;
            getShareImage(selector, { ...options, imageQuality: imageQuality });
          } else {
            resolve(URL.createObjectURL(blob));
          }
        });
      });
    });
  };

  const options = {
    imageQuality: 1,
    imageType: "image/jpeg",
    compressQuality: 0.02,
    finalSize: 4194304, //4mb Size
  };

  const getBlobData = async () => {
    let URL = await getShareImage(document.getElementById("app"), options);
    console.log("YEAH I GENERATED", URL);
  };

  return (
    <div className="App" id="app">
      <h1 onClick={getBlobData}>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <img src={testImage} alt="i" />
    </div>
  );
}
