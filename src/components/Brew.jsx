import { h2 } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import ThanksYou from "./ThanksYou";

function Brew() {
  const [animationState, setAnimationState] = useState(0);

  // Control the animation sequence
  useEffect(() => {
    // Start logo fade in
    const timer1 = setTimeout(() => setAnimationState(1), 500);

    // Start logo slide up and shrink + show other elements
    const timer2 = setTimeout(() => setAnimationState(2), 2500);

    // Hide all content
    const timer3 = setTimeout(() => setAnimationState(3), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  return (
    <div className="bg-brew_bg max-w-[500px] h-svh bg-no-repeat bg-cover bg-center  mx-auto p-6 flex flex-col items-center justify-center relative">
      {animationState >=3 ? (
        <Login/>
        // <ThanksYou/>
      ) : (
        <>
          <div className="w-full flex justify-between items-center ">
            {/* First SVG positioned on the left */}
            <img
              className={`h-24 object-contain ${
                animationState <= 1 ? "opacity-100" : "opacity-0"
              }`}
              src="/brew/Brew-right.svg"
              alt="Brew SVG Left"
            />
            <div></div>
          </div>

          <div
            className={`transition-all duration-1000 ease-in-out flex items-center justify-center ${
              animationState === 0 ? "opacity-0" : "opacity-100"
            } ${animationState >= 2 ? "scale-75 " : "scale-100"} ${
              animationState >= 3 ? "opacity-0" : "opacity-100"
            }`}
            style={{
              transitionProperty: "opacity, transform, scale",
              height: animationState >= 2 ? "150px" : "300px",
            }}
          >
            <img
              className={`h-72 object-contain my-4 `}
              src="/brew/BrewLogo.png"
              alt="BrewLogo"
            />
          </div>

          <div className="w-full flex justify-between items-center">
            <div></div>
            <img
              className={`h-24 object-contain ${
                animationState <= 1 ? "opacity-100" : "opacity-0 "
              }`}
              src="/brew/Brew-right.svg"
              alt="Brew SVG Right"
            />
          </div>
        </>
      )}

      {/* Centered image at the bottom */}
      <img
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2"
        src="/brew/powred.svg"
        alt="powred"
      />
    </div>
  );
}

export default Brew;
