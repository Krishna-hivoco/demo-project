import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ThanksYou({ setShowThankYou }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Effect for fade-in animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
      className="w-full h-full flex items-center justify-center relative  "
    >
      <img
        onClick={() => setShowThankYou(false)}
        className={`h-44 object-contain absolute top-3 left-1/2 transform -translate-x-1/2`}
        src="/brew/BrewLogo.png"
        alt="BrewLogo"
      />
      <div className="w-full mt-32 relative">
        <img
          className={`h-24 object-contain absolute -top-20 left-0 `}
          src="/brew/Brew-right.svg"
          alt="Brew SVG Right"
        />

        <img
          className={`h-24 object-contain absolute -bottom-20 right-0`}
          src="/brew/Brew-wrong.svg"
          alt="Brew SVG Right"
        />

        <div
          style={{ background: "rgba(255, 255, 255, 0.4)" }}
          className=" w-full rounded-2xl  p-10"
        >
          <div className="w-full flex justify-center items-center flex-col gap-6">
            <h2 className="text-center text-2xl text-white font-bold">
              THANK YOU FOR PARTICIPATING!
            </h2>
            <p className="text-center text-base text-white  ">
              Your Memento will be shared on your Whatsapp in sometime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThanksYou;
