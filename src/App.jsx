import React, { useEffect } from "react";
import Layout from "./components/Layout";
import Splash from "./components/Splash";
import Feadback from "./components/Feadback";
import Congratulation from "./components/Congratulation";
import Leaderboard from "./components/Leaderboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import InsuranceAgePage from "./components/InsuranceAgePage";
import ICICIVideo from "./components/ICICIVideo";

import InfiniteCarousel from "./components/InfiniteCarousel";
import CardSwiper from "./components/CardSwiper";
// import PdfFlip from "./components/PdfFlip";
import FlipBook from "./components/PdfFlip";
// import ImageSlider from "./components/ImageSlider";

function App() {
  useEffect(() => {
    AOS.init({
      offset: 200, // Offset (in px) from the original trigger point
      duration: 600, // Animation duration in ms
      easing: "ease-in-sine", // Easing function
      delay: 100, // Delay before the animation starts
    });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Splash />} />
        <Route path="/Feadback" element={<Feadback />} />
        <Route path="/congratulation" element={<Congratulation />} />
        <Route path="/leaderboard" element={<Leaderboard />} /> */}
        {/* <Route path="/" element={<InsuranceAgePage />} /> */}
        {/* <Route path="/" element={<ICICIVideo />} /> */}
        <Route path="/" element={<CardSwiper />} />
        {/* <Route path="/" element={< />} /> */}
      </Routes>
    </BrowserRouter>

    //  <Splash/>
    //  <Leaderboard/>
    //  <Congratulation/>
  );
}

export default App;

// import axios from "axios";
// import React, { useState } from "react";

// const App = () => {
//   const [base64Image, setBase64Image] = useState("");
//   const [response, setResponse] = useState("");
//   const [isDragging, setIsDragging] = useState(false);

//   // Convert file to Base64
//   const handleFile = (file) => {
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBase64Image(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     handleFile(file);
//   };

//   // Handle drag and drop events
//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setIsDragging(false);
//     const file = event.dataTransfer.files[0];
//     handleFile(file);
//   };

//   const callFunction = async () => {
//     try {
//       const response = await axios.post("http://192.168.254.175:5000/process", {
//         image: base64Image,
//       });
//       setResponse(response.data.message);
//       console.log("Response:", response);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center space-y-4 p-8">
//       <div
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         className={`w-80 h-40 border-2 border-dashed rounded-md flex items-center justify-center
//           ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
//       >
//         <p className="text-sm text-gray-500">
//           {isDragging
//             ? "Drop the image here"
//             : "Drag & drop an image or click to upload"}
//         </p>
//       </div>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="block w-60 p-2 text-sm text-gray-500
//           file:mr-4 file:py-2 file:px-4
//           file:rounded-full file:border-0
//           file:text-sm file:font-semibold
//           file:bg-blue-100 file:text-blue-700
//           hover:file:bg-blue-200"
//       />

//       <textarea
//         value={base64Image}
//         readOnly
//         rows="6"
//         className="w-80 p-4 text-sm border border-gray-300 rounded resize-none"
//       />

//       {base64Image && (
//         <img
//           src={base64Image}
//           alt="Image Preview"
//           className="w-60 h-60 object-contain border border-gray-300 rounded-md"
//         />
//       )}

//       {base64Image && (
//         <button
//           onClick={callFunction}
//           className="w-40 p-4 rounded-2xl bg-orange-600 text-white"
//         >
//           Send
//         </button>
//       )}
//       {response &&
//         <p
//           className="text-[#2C2C2C] font-sf-pro-display-normal text-sm lg:text-2xl  pb-6 max-w-[800px] h-auto "
//           dangerouslySetInnerHTML={{ __html: response }}
//         />
//       }
//     </div>
//   );
// };

// export default App;

// import axios from "axios";
// import React, { useState } from "react";

// const App = () => {
//   const [base64Image, setBase64Image] = useState("");

//   // Handle file input change
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBase64Image(reader.result); // Set Base64 string
//       };
//       reader.readAsDataURL(file); // Convert file to Base64 string
//     }
//   };

//   const callFunction = async ({ base64Image }) => {
//     const response = await axios.post("/", {});
//     console.log("response", response);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center space-y-4 p-8">
//       {/* File Input */}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="block w-60 p-2 text-sm text-gray-500
//           file:mr-4 file:py-2 file:px-4
//           file:rounded-full file:border-0
//           file:text-sm file:font-semibold
//           file:bg-blue-100 file:text-blue-700
//           hover:file:bg-blue-200"
//       />

//       {/* Display Base64 string */}
//       <textarea
//         value={base64Image}
//         readOnly
//         rows="6"
//         className="w-80 p-4 text-sm border border-gray-300 rounded resize-none"
//       />

//       {/* Display Image Preview */}
//       {base64Image && (
//         <img
//           src={base64Image}
//           alt="Image Preview"
//           className="w-60 h-60 object-contain border border-gray-300 rounded-md"
//         />
//       )}

//       {base64Image && (
//         <button
//           onClick={() => callFunction(base64Image)}
//           className="w-40 p-4 rounded-2xl bg-orange-600 text-white"
//         >
//           Send
//         </button>
//       )}
//     </div>
//   );
// };

// export default App;
