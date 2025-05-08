import { useEffect, useState } from "react";
// import { login, logout, syncAuthState } from "./redux/features/authSlice";
import { Outlet } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import spinner from "/spinner.svg";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import authService from "./services/authService";
import { login, logout } from "./redux/features/authSlice";
import Loading from "./components/Loading";


function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const authenticated = localStorage.getItem("accessToken");

    if (authenticated && userStatus == false) {
      authService
        .getUser()
        .then((userData) => {
          if (userData) {
            dispatch(login(userData.data));
          } else {
            dispatch(logout());
          }
        })
        .finally(() => setLoading(false));
    } else {
      dispatch(logout());
      setLoading(false);
    }
  }, []);



  return !loading ? (
    <div className="min-h-screen bg-slate-700 box-border text-white">
      <ScrollToTop />
      <Navbar />
      <Toaster position="right-bottom" reverseOrder={false} />
      <Outlet />
      <Footer />

    </div>
  ) : (
    <Loading/>
  );
}

export default App;
