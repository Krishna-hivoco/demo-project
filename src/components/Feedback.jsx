import React from "react";
import BackLayout from "./BackLayout";
import { IoArrowBack } from "react-icons/io5";
import Button from "../elements/Button";
import { useLocation, useNavigate } from "react-router-dom";

function Feedback() {
  const location = useLocation();
  const response = location.state?.response;
  const actualimage = location.state?.actualimage;
  const setStack = location.state?.setStack;
  const navigate = useNavigate();
  const goBack = (path) => {
    navigate(path);
  };

  return (
    <BackLayout>
      <div className="h-full flex flex-col w-full  ">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <IoArrowBack
              className="cursor-pointer w-6 h-6"
              onClick={() => goBack(-1)}
            />
            <img
              onClick={() => goBack("/")}
              className=" w-32 h-14 mx-auto cursor-pointer"
              src="/logo.png"
              alt="logo"
              srcSet=""
            />
            <IoArrowBack className="hidden" />
          </div>
          <div className="flex flex-col mt-2  gap-4">
            <img
              className="max-h-56 "
              src={actualimage}
              alt="Your image"
              srcSet=""
            />
            <div className=" max-h-40 overflow-x-scroll scrollbar-hide ">
              {response.message}
            </div>
          </div>
        </div>
        <>
          {" "}
          <div className="flex justify-between mb-3  ">
            {response?.photo?.map((e, index) => (
              <img
                key={index}
                src={e}
                className="w-[80px] h-[80px]"
                alt="Your image"
                srcSet=""
              />
            ))}
          </div>
          {response.is_good ? (
            <Button
              onClick={() =>
                navigate("/congratulation", {
                  state: { point: response.point },
                })
              }
              title="Get You Points"
            />
          ) : (
            <Button
              onClick={() => {
                navigate("/");
              }}
              title="Upload New Photo"
            />
          )}
        </>
      </div>
    </BackLayout>
  );
}

export default Feedback;
