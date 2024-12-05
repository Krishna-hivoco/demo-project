import React from "react";
import BackLayout from "./BackLayout";
import { IoArrowBack } from "react-icons/io5";
import Button from "../elements/Button";
import { useLocation, useNavigate } from "react-router-dom";

function Congratulation() {
  const location = useLocation();
  const point = location.state?.point;
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
          <div className="flex flex-col justify-center items-center mt-2 mb-2  gap-4">
            <img src="/congratulation.gif" alt="" srcset="" />
            <strong className="font-bold text-2xl">Congratulations</strong>
            <p className="font-normal text-base text-center">
              Your photo looks great! You have arranged the biscuits perfectly.
              You’re rewarded '100' points. Keep it up!
            </p>
            <div className="flex justify-center items-center bg-[#FFF7CD] p-1">
              <img src="/gold.svg" alt="Gold star" />
              <span className="text-[#F49D1D] text-base font-semibold">
                + {point ||90}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/leaderboard",{state:{point:point}})}
          title="View Leaderboard"
        />
      </div>
    </BackLayout>
  );
}

export default Congratulation;
