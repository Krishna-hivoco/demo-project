import React, { useEffect, useState } from "react";
import BackLayout from "./BackLayout";
import { IoArrowBack } from "react-icons/io5";
import Button from "../elements/Button";
import { useLocation, useNavigate } from "react-router-dom";

function Leaderboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const point = location.state?.point;
  const [data, setData] = useState([
    { name: "Amit", phone: 9876543210, point: 42 },
    { name: "Kiran", phone: 9876123456, point: 99 },
    { name: "Meera", phone: 9988776655, point: 25 },
    { name: "Rahul", phone: 8765432190, point: 34 },
    { name: "Suresh", phone: 9345678123, point: 50 },
    { name: "Deepa", phone: 9198765432, point: 97 },
    { name: "Rakesh", phone: 9087654321, point: 98 },
  ]);
  const goBack = (path) => {
    navigate(path);
  };
  function maskPhoneNumber(number) {
    // Ensure the number is a string
    const numStr = number.toString();

    // Get the first 3 digits, then the last 2 digits, and hide the middle part with asterisks
    const masked = numStr.slice(0, 3) + "*****" + numStr.slice(-2);

    return masked;
  }

  useEffect(() => {
    setData([
      ...data,
      {
        name: sessionStorage.getItem("name") || "Pritesh",
        phone: sessionStorage.getItem("phone") || 9345678123,
        point: point || 90,
      },
    ]);
  }, [point]);
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
              className=" w-32 h-14 mx-auto"
              src="/logo.png"
              alt="logo"
              srcSet=""
            />
            <IoArrowBack className="hidden" />
          </div>
          <div className="flex flex-col justify-center items-center mt-2 mb-2  gap-4">
            <img src="/leaderboard.png" alt="leaderboard" srcSet="" />

            <div className="relative w-full">
              <div className=" absolute -top-16  left-1/2  transform -translate-x-1/2 flex flex-col justify-center items-center">
                <img className="h-36 -mb-3 z-40" src="/1st.png" alt="medal" />
                <div className="border bg-white flex justify-center items-center flex-col py-2 px-3 gap-1 rounded-xl ">
                  <strong className="text-base font-semibold">Kiran</strong>
                  <div className="flex justify-center items-center p-1">
                    <img src="/gold.svg" alt="Gold star" />
                    <span className="text-[#F49D1D] text-base font-semibold">
                      + 99
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-3 flex flex-col justify-center items-center">
                <img
                  className="h-24 -mb-3 z-40"
                  src="/second.png"
                  alt="medal"
                />
                <div className="border bg-white flex justify-center items-center flex-col py-2 px-3 gap-1 rounded-xl ">
                  <strong className="text-base font-semibold">Rakesh</strong>
                  <div className="flex justify-center items-center p-1">
                    <img src="/gold.svg" alt="Gold star" />
                    <span className="text-[#F49D1D] text-base font-semibold">
                      + 98
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 top-5 flex flex-col justify-center items-center">
                <img className="h-20 -mb-3 z-40" src="/3rd.png" alt="medal" />
                <div className="border bg-white flex justify-center items-center flex-col py-2 px-3 gap-1 rounded-xl ">
                  <strong className="text-base font-semibold">Deepa</strong>
                  <div className="flex justify-center items-center p-1">
                    <img src="/gold.svg" alt="Gold star" />
                    <span className="text-[#F49D1D] text-base font-semibold">
                      + 97
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-20  max-h-80  overflow-y-scroll scrollbar-hide ">
          <div className="bg-[#94BC14] text-white px-5 py-3 flex justify-between items-start  rounded-t-lg">
            <small className="text-sm font-semibold">Seller name</small>
            <small className="text-sm font-semibold">Ph. number</small>
            <small className="text-sm font-semibold">Points</small>
          </div>
          {data
            ?.sort((a, b) => b.point - a.point) // Sort the data array by points in descending order
            .map((e, id) => (
              <div
                key={id}
                className="bg-[#94BC14] text-white px-5 py-3 flex justify-between items-start"
              >
                <small>{e.name}</small>
                <small>{maskPhoneNumber(e.phone)}</small>
                <small>{e.point}</small>
              </div>
            ))}
        </div>
      </div>
    </BackLayout>
  );
}

export default Leaderboard;
