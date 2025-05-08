import React, { forwardRef, useId } from "react";

const Input = forwardRef(
  (
    {
      type = "text",
      placeholder = "",
      className = "",
      label = "",
      p = 2,
      ...props
    },
    ref
  ) => {
    const id = useId();

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 pb-1"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          ref={ref}
          className={`w-full border text-gray-800 border-gray-300 p-${p} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A237E] ${className}`}
          {...props}
        />
      </div>
    );
  }
);

export default Input;