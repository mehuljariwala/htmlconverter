import "./App.css";
import { toJpeg, toBlob, toPng } from "html-to-image";
import testImage from "./1231.jpeg";

export default function App() {
  // const toBlob = (dataUrl, imageType = "image/jpeg") => {
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

  // const getShareImage = (selector, options) => {
  //   return new Promise((resolve) => {
  //     let { imageQuality, imageType, finalSize, compressQuality } = options;
  //     toJpeg(selector, { quality: imageQuality }).then((dataUrl) => {
  //       toBlob(dataUrl, imageType).then((blob) => {
  //         if (blob.size > finalSize) {
  //           imageQuality = imageQuality - compressQuality;
  //           getShareImage(selector, { ...options, imageQuality: imageQuality });
  //         } else {
  //           resolve(URL.createObjectURL(blob));
  //         }
  //       });
  //     });
  //   });
  // };

  // function draw() {
  //   var ctx = document.getElementById("canvas").getContext("2d");
  //   var img = new Image();
  //   img.onload = function () {
  //     ctx.drawImage(img, 0, 0);
  //   };
  //   img.src = "/files/4531/backdrop.png";
  // }

  const resizeMe = (img) => {
    let max_width = 500;
    let max_height = 500;

    var canvas = document.createElement("canvas");

    var width = img.width;
    var height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > max_width) {
        //height *= max_width / width;
        height = Math.round((height *= max_width / width));
        width = max_width;
      }
    } else {
      if (height > max_height) {
        //width *= max_height / height;
        width = Math.round((width *= max_height / height));
        height = max_height;
      }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", 0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)
  };

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

  const getScreenshot = (selector, options) => {
    let { imageQuality, compressQuality, finalSize } = options;
    console.log("hi");
    toJpeg(selector, {
      quality: imageQuality,
      pixelRatio: 1,
      backgroundColor: "gray",
    }).then((res) => {
      toBlobConvert(res).then((blob) => {
        console.log(blob.size, finalSize, imageQuality);
        if (blob.size > finalSize) {
          imageQuality = imageQuality - compressQuality;
          getScreenshot(document.getElementById("phanny"), {
            ...options,
            imageQuality: imageQuality,
          });
        } else {
          console.log(URL.createObjectURL(blob));
        }
      });
    });
    // toPng(document.getElementById("app")).then((dataUrl) => {
    //   console.log(dataUrl);
    //   // downscaleImage(dataUrl).then((res) => {
    //   //   console.log(res);
    //   // });
    // });

    // toBlob(document.getElementById("app")).then(function (blob) {
    //   let blobURL = window.URL.createObjectURL(blob); // and get it's URL
    //   var canvas = document.createElement("canvas");

    //   console.log(blobURL);
    //   canvas.toDataURL("image/png");
    //   var image = new Image();
    //   image.src = blobURL;

    //   canvas.width = 2000;
    //   canvas.height = 2000;
    //   var ctx = canvas.getContext("2d");
    //   ctx.drawImage(image, 0, 0, 3000, 3000);

    //   console.log(image);
    //   // toBlobConvert(UU).then((response) => {
    //   //   blobURL = window.URL.createObjectURL(response);
    //   //   console.log(blobURL, response.size);
    //   // });
    // });
  };

  function getImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = dataUrl;
      image.onload = () => {
        resolve(image);
      };
    });
  }

  async function downscaleImage(
    dataUrl,
    imageType, // e.g. 'image/jpeg'
    resolution, // max width/height in pixels
    quality // e.g. 0.9 = 90% quality
  ) {
    // Create a temporary image so that we can compute the height of the image.
    const image = await getImage(dataUrl);
    const oldWidth = image.naturalWidth;
    const oldHeight = image.naturalHeight;
    console.log("dims", oldWidth, oldHeight);

    const longestDimension = oldWidth > oldHeight ? "width" : "height";
    const currentRes = longestDimension === "width" ? oldWidth : oldHeight;
    console.log("longest dim", longestDimension, currentRes);

    if (currentRes > resolution) {
      console.log("need to resize...");

      // Calculate new dimensions
      const newSize =
        longestDimension === "width"
          ? Math.floor((oldHeight / oldWidth) * resolution)
          : Math.floor((oldWidth / oldHeight) * resolution);
      const newWidth = longestDimension === "width" ? resolution : newSize;
      const newHeight = longestDimension === "height" ? resolution : newSize;
      console.log("new width / height", newWidth, newHeight);

      // Create a temporary canvas to draw the downscaled image on.
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the downscaled image on the canvas and return the new data URL.
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      const newDataUrl = canvas.toDataURL(imageType, quality);
      return newDataUrl;
    } else {
      return dataUrl;
    }
  }

  const options = {
    imageQuality: 1,
    imageType: "image/jpeg",
    compressQuality: 0.02,
    finalSize: 4194304, //4mb Size
  };

  const getBlobData = async () => {
    let URL = getScreenshot(document.getElementById("phanny"), options);
    // let URL = await getShareImage(document.getElementById("app"), options);
    console.log("YEAH I GENERATED", URL);
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

// function getShareImage(selector, options) {
//   let {imageQuality, compressQuality, finalSize } = options;
//   html2canvas(document.querySelector(selector), { allowTaint: true }).then(canvas => {
//     canvas.toBlob(function (blob) {
//       if (blob.size > finalSize) {
//         imageQuality = imageQuality - compressQuality;
//         getShareImage(selector, {...options, imageQuality : imageQuality })
//       } else {
//         return URL.createObjectURL(blob);
//       }
//     }, options.imageType, imageQuality);
//   })
// }

// var minifyImg = function (
//   dataUrl,
//   newWidth,
//   imageType = "image/jpeg",
//   resolve,
//   imageArguments = 0.7
// ) {
//   var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;
//   new Promise(function (resolve) {
//     image = new Image();
//     image.src = dataUrl;
//     console.log(image);
//     resolve("Done : ");
//   }).then((d) => {
//     oldWidth = image.width;
//     oldHeight = image.height;
//     console.log([oldWidth, oldHeight]);
//     newHeight = Math.floor((oldHeight / oldWidth) * newWidth);
//     console.log(d + " " + newHeight);

//     canvas = document.createElement("canvas");
//     canvas.width = newWidth;
//     canvas.height = newHeight;
//     console.log(canvas);
//     ctx = canvas.getContext("2d");
//     ctx.drawImage(image, 0, 0, newWidth, newHeight);
//     //log(ctx);
//     newDataUrl = canvas.toDataURL(imageType, imageArguments);
//     resolve(newDataUrl);
//   });
// };
