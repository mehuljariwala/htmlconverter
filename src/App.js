import "./App.css";
import testImage from "./1231.jpeg";
import { getShareImage } from "./helper";

export default function App() {
  const handleImage = async () => {
    const options = {
      imageQuality: 1,
      imageType: "image/jpeg",
      compressQuality: 0.02,
      finalSize: 4194304, //4mb Size
    };
    const selector = document.getElementById("test-demo");
    let blobURL = await getShareImage(selector, options);
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
        </div>
      </div>
    </div>
  );
}
