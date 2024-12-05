import React, { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import InputField from "../elements/InputField";
import Button from "../elements/Button";
import { AiOutlineSend } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Splash() {
  const [stack, setStack] = useState(0);
  // const [responseData, setResponseData] = useState();
  const inputRef = useRef(null);
  const [base64Image, setBase64Image] = useState("");
  const [user, setUser] = useState({
    name: "",
    phone: "",
  });
  const [store, setStore] = useState({
    name: "",
    location: "",
    city: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => setStack(1), 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

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

  // Open the camera and stream to the video element
  const startCamera = async () => {
    try {
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   video: { facingMode: { exact: "environment" } }, // Forces the use of the back camera
      // });
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
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

  // function removeBase64Prefix(base64String) {
  //   return base64String.replace(/^data:image\/jpeg;base64,/, "");
  // }

  const APICall = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://whirlpool-hindi.interactivedemos.io/process",
        {
          image: imageDataUrl,
          right_upload: false,
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
              {stack === 1 && (
                <>
                  {" "}
                  <div className=" flex-1 gap-4 flex flex-col justify-center items-center   ">
                    <InputField
                      type="text"
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      placeholder={"Enter name"}
                    />
                    <InputField
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
                    <InputField placeholder={"Enter store name"} />
                    <InputField placeholder={"Locality"} />
                    <InputField placeholder={"City"} />
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
