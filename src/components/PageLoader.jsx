import React from "react";
import spinner from "/spinner.svg";

// src/components/PageLoader.jsx
const PageLoader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <img src={spinner} alt="" className="h-14 " />
    </div>
  );
};

export default PageLoader;