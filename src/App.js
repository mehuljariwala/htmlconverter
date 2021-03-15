import "./App.css";
import { toJpeg } from "html-to-image";
import testImage from "./1231.jpeg";

export default function App() {
 
  const toBlobConvert = (dataUrl, imageType = "image/png") => {
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

  const getScreenshot = (selector, screenShotOptions) => {
    let { imageQuality, compressQuality, finalSize } = screenShotOptions;
    toJpeg(selector, {
      quality: imageQuality,
      pixelRatio: 1,
      backgroundColor: "gray",
    }).then((res) => {
      toBlobConvert(res).then((blob) => {
        console.log(blob.size, finalSize, imageQuality);
        if (blob.size > finalSize) {
          imageQuality = imageQuality - compressQuality;
          getScreenshot(selector, {
            ...options,
            imageQuality: imageQuality,
          });
        } else {
          console.log(URL.createObjectURL(blob));
        }
      });
    });
    
  

  const getBlobData = async () => {
    const options = {
      imageQuality: 1,
      imageType: "image/jpeg",
      compressQuality: 0.02,
      finalSize: 4194304, //4mb Size
    };
    let URL = getScreenshot(document.getElementById("phanny"), options);
  };

  return (
    <div className="App">
      <div>
        <div
          id="phanny"
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "gray",
            color: "white",
            margin: "0",
            padding: "0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1 onClick={getBlobData}>Hello CodeSandbox</h1>
          <h2>Start editing to see some magic happen!</h2>
          <img src={testImage} alt="i" />
          <img src={testImage} alt="i" />
          <img src={testImage} alt="i" />
          <img src={testImage} alt="i" />
        </div>
      </div>
    </div>
  );
}
