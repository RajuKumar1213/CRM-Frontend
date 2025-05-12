import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import authService from "./services/authService";
import { login, logout } from "./redux/features/authSlice";
import Loading from "./components/Loading";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const theme = localStorage.getItem("theme") || "light"; // Default to light theme if not set
  // Use theme context for theme state


  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        
        if (accessToken) {
          // Only fetch user data if we don't already have it
          if (!userStatus) {
            try {
              const response = await authService.getUser();
              if (response && response.data) {
                dispatch(login(response.data));
              } else {
                // Clear invalid session data
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("role");
                dispatch(logout());
              }
            } catch (error) {
              console.error("Auth initialization error:", error);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("role");
              dispatch(logout());
            }
          }
        } else {
          // No token, ensure logged out state
          dispatch(logout());
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Listen for storage events (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" && !e.newValue) {
        // Token was removed in another tab
        dispatch(logout());
      } else if (e.key === "accessToken" && e.newValue) {
        // Token was added in another tab
        authService.getUser()
          .then(userData => {
            if (userData && userData.data) {
              dispatch(login(userData.data));
            }
          })
          .catch(error => {
            console.error("Failed to sync user data across tabs:", error);
          });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }


  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      <ScrollToTop />
      <Navbar />
      <Toaster 
        position="right-bottom" 
        reverseOrder={false}
        toastOptions={{
          className: theme ? 'dark:bg-gray-800 dark:text-white' : '',
          style: {
            background: theme ? '#1f2937' : '#fff',
            color: theme ? '#fff' : '#111827',
          }
        }}
      />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;

