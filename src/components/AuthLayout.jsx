import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import ScrollToTop from "./ScrollToTop";

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    // if (authenticated && authStatus) {
    //   navigate("/");
    // }
    // if (!authenticated && !authStatus) {
    //   navigate("/login");
    // }

    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authentication, authStatus]);

  return loader ? <h1>Loading...</h1> : <div>{children}</div>;
}

export default AuthLayout;