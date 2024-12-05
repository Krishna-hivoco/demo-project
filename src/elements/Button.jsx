import React from "react";
import { MdArrowForward } from "react-icons/md";

function Button({ title, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-white bg-[#94BC14] rounded-lg px-3 py-4 text-lg font-semibold cursor-pointer ${className}`}
      type="button"
    >
      <span className="flex justify-center items-center">{title}</span>
    </button>
  );
}

export default Button;
