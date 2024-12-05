import React from "react";

function InputField({
  value,
  type,
  placeholder,
  className,
  onChange,
  ...rest
}) {
  return (
    <input
      data-aos="zoom-in"
      onChange={onChange}
      value={value}
      className={`px-3 py-4 rounded-lg text-[#7E7E7E] border border-[#000000B2]  w-full bg-transparent font-normal text-sm ${className}`}
      type={type}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export default InputField;
