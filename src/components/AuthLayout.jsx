import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
// import ScrollToTop from "./ScrollToTop";

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [loader, setLoader] = useState(true);
  const role = localStorage.getItem("role")

  // console.log(authStatus)

  useEffect(() => {
    if (!role && authentication) {
      navigate("/login");
    } else if (role && !authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authentication, role, navigate, authStatus]);

  return loader ? <Loading/> : <div>{children}</div>;
}

export default AuthLayout;