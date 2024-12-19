import React, { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import InputField from "../elements/InputField";
import Button from "../elements/Button";
import { AiOutlineSend } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Splash() {
  const [openPrompts, setOpenPrompts] = useState(false);
  const [promptsStatus, setPromptsStatus] = useState("");
  const location = useLocation();
  const [isSecond, setIsSecond] = useState(false);
  const [stack, setStack] = useState(1);
  const [user, setUser] = useState({
    name: "Pritesh",
    phone: 8285022022,
  });
  const [store, setStore] = useState({
    name: "Fortune Store",
    location: "No.28, Tannery Road, Bangalore - 560005",
    city: "Bangalore",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (location?.state?.fromFeedback) {
      changeStack(5);
      startCamera();
      setIsSecond(true);
    } else {
      const timer = setTimeout(() => setStack(1), 500);
      setIsSecond(false);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const changeStack = (number) => {
    setStack(number);
  };

  const handleUserDate = () => {
    if (!user.name || !user.phone) {
      return;
    } else {
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("phone", user.phone);
      changeStack(2);
    }
  };
  const handleStoreDate = () => {
    changeStack(5);
    startCamera();
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  const [text, setText] = useState("");

  const handleChange = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://sangya.thefirstimpression.ai/get_prompt"
        ); // Replace with your API endpoint
        setText(response.data.prompt); // Assuming the API returns { text: "default value" }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [loading]);

  const saveToDatabase = async () => {
    setLoading(true);
    setPromptsStatus("Loading...");
    try {
      await axios.post("https://sangya.thefirstimpression.ai/update_prompt", {
        prompt: text,
      }); // Replace with your save API endpoint
      setOpenPrompts(false);
      setPromptsStatus("Current Prompts Saved");
    } catch (error) {
      console.error("Error saving data:", error);
      setPromptsStatus("Failed to Save Prompts");
      setOpenPrompts(true);
    } finally {
      setLoading(false);
      setPromptsStatus("");
    }
  };
  // Open the camera and stream to the video element
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }, // Forces the use of the back camera
        width: { ideal: 1920 }, // 1920px width (Full HD)
        height: { ideal: 1080 },
      });
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setImageDataUrl(imageDataUrl);

    return;
  };

  const APICall = async () => {
    setIsSecond(true);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://sangya.thefirstimpression.ai/process",
        {
          image: imageDataUrl,
          isSecond: isSecond,
        }
      );

      setLoading(false);
      navigate("/Feadback", {
        state: {
          response: response.data,
          actualimage: imageDataUrl,
        },
      });
    } catch (err) {
      setLoading(false);
    } finally {
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}{" "}
      {stack === 5 ? (
        <div className="relative w-svw h-svh bg-black  overflow-hidden">
          <img
            onClick={() => {
              setImageDataUrl(null);
              changeStack(3);
            }}
            className=" cursor-pointer absolute top-10 right-8 z-50"
            src="/cut.png"
            alt="Cross"
          />
          {imageDataUrl ? (
            <img
              className="w-full h-full object-cover"
              src={imageDataUrl}
              alt="image"
              srcSet=""
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ display: streaming ? "block" : "none" }}
              autoPlay
              playsInline
            ></video>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          {streaming && (
            <>
              {imageDataUrl ? (
                <AiOutlineSend
                  onClick={() => APICall()}
                  className={` absolute bottom-10 left-1/2  transform -translate-x-1/2 text-white h-16 w-16`}
                />
              ) : (
                <img
                  onClick={() => captureImage()}
                  className="cursor-pointer absolute left-1/2 bottom-10 transform -translate-x-1/2 "
                  src="/camera.png"
                  alt="Camera"
                />
              )}
            </>
          )}
        </div>
      ) : (
        <Layout>
          <div className="h-full">
            <div className="flex flex-col h-full">
              <img
                onClick={() => navigate("/")}
                className={`w-64 h-28 mx-auto transition-all delay-300 duration-700 ${
                  stack == 0 ? "translate-y-56 " : ""
                } `}
                src="/logo.png"
                alt="logo"
                srcSet=""
              />
              <span
                onClick={() => setOpenPrompts(true)}
                className="underline text-sm text-red-500 mx-auto cursor-pointer"
              >
                Change Prompt
              </span>
              {openPrompts && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50"
                  // onClick={togglePopup} // Close popup when clicking outside
                >
                  <div className=" flex flex-col justify-center items-center gap-10 ">
                    <textarea
                      value={text}
                      onChange={handleChange}
                      placeholder="Type something here..."
                      rows="20"
                      cols="40"
                      className="scrollbar-hide text-lg outline-none rounded-lg p-5"
                    />
                    <Button
                      onClick={() => saveToDatabase()}
                      className={`w-40`}
                      title="Save"
                    />
                    <span className="text-red-500">{promptsStatus}</span>
                  </div>
                </div>
              )}

              {stack === 1 && (
                <>
                  {" "}
                  <div className=" flex-1 gap-4 flex flex-col justify-center items-center   ">
                    <InputField
                      value={user.name}
                      type="text"
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      placeholder={"Enter name"}
                    />
                    <InputField
                      value={user.phone}
                      type="tel"
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                      placeholder={"Enter phone number"}
                      inputMode="numeric"
                      maxLength={10}
                    />
                  </div>
                  <Button
                    onClick={() => handleUserDate()}
                    className={``}
                    title="Continue"
                  />
                </>
              )}
              {stack === 2 && (
                <>
                  {" "}
                  <div className=" flex-1 gap-4 flex flex-col  items-center   ">
                    <img src="/biscuits.png" alt="Biscuits" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={() => changeStack(3)}
                      className={``}
                      title="Take Picture"
                    />
                    <Button
                      onClick={() => navigate("/leaderboard")}
                      className={``}
                      title="View Leaderboard"
                    />
                  </div>
                </>
              )}
              {stack === 3 && (
                <>
                  <div className=" flex-1 gap-4 flex flex-col justify-center items-center   ">
                    <InputField
                      value={store.name}
                      placeholder={"Enter store name"}
                    />
                    <InputField
                      value={store.location}
                      placeholder={"Locality"}
                    />
                    <InputField value={store.city} placeholder={"City"} />
                  </div>

                  <Button
                    onClick={() => {
                      handleStoreDate();
                    }}
                    className={``}
                    title="Take Picture"
                  />
                </>
              )}
            </div>
          </div>
        </Layout>
      )}
    </>
  );
}

export default Splash;
