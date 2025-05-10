import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import authService from "../services/authService";
import { login, logout } from "../redux/features/authSlice";

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [loader, setLoader] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");
        
        // For protected routes where authentication is required
        if (authentication) {
          // If no token or not authenticated in Redux state
          if (!accessToken || !authStatus) {
            // If token exists but Redux state doesn't match, try to validate token
            if (accessToken) {
              try {
                const userData = await authService.getUser();
                if (userData && userData.data) {
                  // Valid token and user data - update Redux
                  dispatch(login(userData.data));
                  setLoader(false);
                } else {
                  // Invalid response - clear auth and redirect
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("role");
                  dispatch(logout());
                  navigate("/login");
                }
              } catch (error) {
                // API error - clear auth and redirect
                console.error("Auth validation error:", error);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("role");
                dispatch(logout());
                navigate("/login");
              }
            } else {
              // No token at all - redirect to login
              navigate("/login");
            }
          } else {
            // Already authenticated according to Redux - just stop loading
            setLoader(false);
          }
        } 
        // For public routes (login, signup, etc.)
        else if (!authentication && accessToken && authStatus) {
          // User is already logged in, redirect to appropriate dashboard
          navigate(role === "admin" ? "/admin-dashboard" : "/e-dashboard");
        } else {
          // Public route and not authenticated - just stop loading
          setLoader(false);
        }
      } catch (error) {
        console.error("Authentication layout error:", error);
        if (authentication) {
          // For auth routes, ensure clean slate on error
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");
          dispatch(logout());
          navigate("/login");
        }
        setLoader(false);
      }
    };

    checkAuth();
  }, [authentication, authStatus, navigate, dispatch]);

  // Don't render anything during loading
  if (loader) {
    return <Loading />;
  }

  // Render children once authentication is confirmed
  return <>{children}</>;
}

export default AuthLayout;