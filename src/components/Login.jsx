

// import React, { useEffect, useState } from "react";
// import { Upload } from "lucide-react";
// import ThanksYou from "./ThanksYou";

// function Login() {
//   const [fileName, setFileName] = useState("No file chosen");
//   const [fullName, setFullName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showThankYou, setShowThankYou] = useState(false);

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFileName(file.name);
//       setSelectedFile(file);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Reset states
//       setError("");
//       setSuccess("");

//       // Validate inputs
//       if (!fullName.trim()) {
//         setError("Please enter your full name");
//         return;
//       }

//       if (!phoneNumber.trim()) {
//         setError("Please enter your phone number");
//         return;
//       }

//       if (!selectedFile) {
//         setError("Please select an image");
//         return;
//       }

//       if (selectedFile.size > 10 * 1024 * 1024) {
//         setError(
//           "File size too large. Please select an image smaller than 10MB."
//         );
//         return;
//       }

//       // Verify it's an image
//       if (!selectedFile.type.startsWith("image/")) {
//         setError("Please select a valid image file.");
//         return;
//       }

//       // Set loading state
//       setIsSubmitting(true);

//       // Create FormData object
//       const formData = new FormData();
//       formData.append("name", fullName);
//       formData.append("phone_number", phoneNumber);
//       formData.append("photo", selectedFile);

//       // Make API call
//       const response = await fetch(
//         "https://sampann-open.thefirstimpression.ai/api/upload",
//         {
//           method: "POST",
//           body: formData,
//           // Don't set Content-Type header, it will be set automatically with boundary for FormData
//         }
//       );

//       // Handle response
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to submit form");
//       }

//       const data = await response.json();

//       setSuccess("Form submitted successfully!");

//       // Optional: Reset form after successful submission
//       setFullName("");
//       setPhoneNumber("");
//       setFileName("");
//       setSelectedFile(null);
//       setTimeout(() => {
//         setShowThankYou(true);
//       }, 1000);
//     } catch (err) {
//       setError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const [isVisible, setIsVisible] = useState(false);

//   // Effect for fade-in animation when component mounts
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {showThankYou ? (
//         <ThanksYou setShowThankYou={setShowThankYou} />
//       ) : (
//         <div
//           style={{
//             opacity: isVisible ? 1 : 0,
//             transition: "opacity 0.8s ease-in-out",
//           }}
//           className="w-full h-full flex items-center justify-center relative  "
//         >
//           <img
//             className={`h-44 object-contain absolute top-3 left-1/2 transform -translate-x-1/2`}
//             src="/brew/BrewLogo.png"
//             alt="BrewLogo"
//           />
//           <div className="w-full mt-32 relative">
//             <img
//               className={`h-24 object-contain absolute -top-20 left-0 `}
//               src="/brew/Brew-right.svg"
//               alt="Brew SVG Right"
//             />

//             <img
//               className={`h-24 object-contain absolute -bottom-20 right-0`}
//               src="/brew/Brew-wrong.svg"
//               alt="Brew SVG Right"
//             />

//             <div
//               style={{ background: "rgba(255, 255, 255, 0.4)" }}
//               className=" w-full rounded-2xl py-4 px-6"
//             >
//               {error && (
//                 <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
//                   {error}
//                 </div>
//               )}

//               {success && (
//                 <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
//                   {success}
//                 </div>
//               )}

//               <div className="mb-2">
//                 <label
//                   className="block text-[#FFFFFF] font-semibold  text-sm  mb-2"
//                   htmlFor="fullname"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   className=" appearance-none placeholder:text-[#FFFFFF] placeholder:opacity-50 bg-transparent border border-[#FFFFFF]  w-full py-3 px-3 text-[#FFFFFF] leading-tight focus:outline-none focus:shadow-outline rounded-lg text-sm"
//                   id="fullname"
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                 />
//               </div>
//               <div className="mb-2">
//                 <label
//                   className="block text-[#FFFFFF] font-semibold  text-sm  mb-2"
//                   htmlFor="phone"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   className=" appearance-none placeholder:text-[#FFFFFF] placeholder:opacity-50 text-[#FFFFFF] bg-transparent border border-[#FFFFFF]  w-full py-3 px-3 text-[#FFFFFF]leading-tight focus:outline-none focus:shadow-outline rounded-lg text-sm"
//                   id="phone"
//                   type="tel"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   placeholder="Enter your phone number"
//                   value={phoneNumber}
//                   minLength="10"
//                   maxLength="10"
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                 />
//               </div>
//               <div className="text-[#FFFFFF]">
//                 <label
//                   className="block text-[#FFFFFF] font-semibold  text-sm  mb-2"
//                   htmlFor="fullname"
//                 >
//                   Image
//                 </label>
//                 <div className="flex items-center justify-between flex-row-reverse border border-white rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
//                   {/* <input
//                     className="placeholder:text-[#FFFFFF] bg-transparent outline-none border-none   w-full py-2 px-3 text-[#FFFFFF]leading-tight focus:outline-none focus:shadow-outline rounded-lg"
//                     id="filename"
//                     type="text"
//                     placeholder="Choose a file"
//                     value={fileName}
//                     readOnly
//                   /> */}
//                   <p className="placeholder:text-[#FFFFFF] opacity-50 bg-transparent outline-none border-none  w-full py-2 px-3 text-[#FFFFFF]leading-tight focus:outline-none focus:shadow-outline rounded-lg text-sm max-w-40">
//                     {fileName}
//                   </p>
//                   <label
//                     htmlFor="file-upload"
//                     className="flex items-center px-3 py-3 cursor-pointer bg-[#31027A]  text-white transition duration-300  "
//                   >
//                     <Upload size={16} className="mr-1" />
//                     <span>Browse</span>
//                   </label>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     // capture="environment"
//                   />
//                 </div>
//               </div>
//               <span className="text-xs text-[#FFFFFF] ">
//                 **The data will be deleted immediately upon delivery of the
//                 memento.
//               </span>
//               <div className="mt-2">
//                 <button
//                   className="w-full py-3 px-3 text-[#FFFFFF] bg-[#006AFF] leading-tight focus:shadow-outline rounded-lg  disabled:opacity-70 text-sm"
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Login;


import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import ThanksYou from "./ThanksYou";

function Login() {
  const [fileName, setFileName] = useState("No file chosen");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setSelectedFile(file);

      // Log file info for debugging
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Reset states
      setError("");
      setSuccess("");

      // Validate inputs
      if (!fullName.trim()) {
        setError("Please enter your full name");
        return;
      }

      if (!phoneNumber.trim()) {
        setError("Please enter your phone number");
        return;
      }

      if (!selectedFile) {
        setError("Please select an image");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError(
          "File size too large. Please select an image smaller than 10MB."
        );
        return;
      }

      // Verify it's an image - more permissive check for iOS
      const isImage =
        selectedFile.type.startsWith("image/") ||
        selectedFile.name.match(/\.(jpg|jpeg|png|gif|heic|heif)$/i);

      if (!isImage) {
        setError("Please select a valid image file.");
        return;
      }

      // Set loading state
      setIsSubmitting(true);

      // Create FormData object
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("phone_number", phoneNumber);
      formData.append("photo", selectedFile);

      console.log("Submitting form with file:", selectedFile.name);

      // Make API call with explicit timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        "https://sampann-open.thefirstimpression.ai/api/upload",
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
          // Don't set Content-Type header, it will be set automatically with boundary for FormData
        }
      );

      clearTimeout(timeoutId);

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      const data = await response.json();

      setSuccess("Form submitted successfully!");

      // Optional: Reset form after successful submission
      setFullName("");
      setPhoneNumber("");
      setFileName("No file chosen");
      setSelectedFile(null);

      setTimeout(() => {
        setShowThankYou(true);
      }, 1000);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  // Effect for fade-in animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showThankYou ? (
        <ThanksYou setShowThankYou={setShowThankYou} />
      ) : (
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
          className="w-full h-full flex items-center justify-center relative"
        >
          <img
            className="h-44 object-contain absolute top-3 left-1/2 transform -translate-x-1/2"
            src="/brew/BrewLogo.png"
            alt="BrewLogo"
          />
          <div className="w-full mt-32 relative">
            <img
              className="h-24 object-contain absolute -top-20 left-0"
              src="/brew/Brew-right.svg"
              alt="Brew SVG Right"
            />

            <img
              className="h-24 object-contain absolute -bottom-20 right-0"
              src="/brew/Brew-wrong.svg"
              alt="Brew SVG Right"
            />

            <div
              style={{ background: "rgba(255, 255, 255, 0.4)" }}
              className="w-full rounded-2xl py-4 px-6"
            >
              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              <div className="mb-2">
                <label
                  className="block text-[#FFFFFF] font-semibold text-sm mb-2"
                  htmlFor="fullname"
                >
                  Full Name
                </label>
                <input
                  className="appearance-none placeholder:text-[#FFFFFF] placeholder:opacity-50 bg-transparent border border-[#FFFFFF] w-full py-3 px-3 text-[#FFFFFF] leading-tight focus:outline-none focus:shadow-outline rounded-lg text-sm"
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label
                  className="block text-[#FFFFFF] font-semibold text-sm mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="appearance-none placeholder:text-[#FFFFFF] placeholder:opacity-50 text-[#FFFFFF] bg-transparent border border-[#FFFFFF] w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline rounded-lg text-sm"
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  minLength="10"
                  maxLength="10"
                  onChange={(e) => {
                    // Allow only numbers
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setPhoneNumber(value);
                  }}
                />
              </div>
              <div className="text-[#FFFFFF]">
                <label
                  className="block text-[#FFFFFF] font-semibold text-sm mb-2"
                  htmlFor="file-upload"
                >
                  Image
                </label>
                <div className="flex items-center justify-between flex-row-reverse border border-white rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                  <p className="placeholder:text-[#FFFFFF] opacity-50 bg-transparent outline-none border-none w-full py-2 px-3 text-[#FFFFFF] leading-tight focus:outline-none focus:shadow-outline rounded-lg text-sm max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
                    {fileName}
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="flex items-center px-3 py-3 cursor-pointer bg-[#31027A] text-white transition duration-300"
                  >
                    <Upload size={16} className="mr-1" />
                    <span>Browse</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <span className="text-xs text-[#FFFFFF]">
                **The data will be deleted immediately upon delivery of the
                memento.
              </span>
              <div className="mt-2">
                <button
                  className="w-full py-3 px-3 text-[#FFFFFF] bg-[#006AFF] leading-tight focus:shadow-outline rounded-lg disabled:opacity-70 text-sm"
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
