import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaLock, FaEnvelope } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "./Button";
import Input from "./Input";
import authService from "../services/authService";
import extractErrorMessage from "../utils/extractErrorMessage";
import spinner from "/spinner.svg";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/authSlice";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (data) => {
    setLoading(true);
    setError("");
    if (!data) {
      toast.error("No form data provided");
      setLoading(false);
      return;
    }

    authService
      .loginUser(data)
      .then((response) => {
        if (response.statusCode === 200 && response.data) {

          const role = response?.data?.user?.role;
          const { accessToken, refreshToken } = response.data;

          // Store access token in localStorage
          if (accessToken && role ) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("role", role);
          } else {
            throw new Error("Access token not provided in response");
          }

          // Store refresh token in secure HttpOnly cookie
          if (refreshToken) {
            const cookieExpires = new Date(
              Date.now() + 2 * 24 * 60 * 60 * 1000
            ); // 7 days
            document.cookie = `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${cookieExpires.toUTCString()}`;
          } else {
            throw new Error("Refresh token not provided in response");
          }

          dispatch(login(response.data.user));
          toast.success("Logged in successfully!");
          navigate("/"); // Adjust redirect as needed
        } else {
          throw new Error("Invalid response from server");
        }
      })  
      .catch((error) => {
        const errorMessage = extractErrorMessage(error);
        toast.error(errorMessage);
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loginImageUrl =
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80";

  return (
    <div className="bg-gray-50 mt-16 md:mt-20 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/2 relative bg-gray-100">
          <img
            src={loginImageUrl}
            alt="Professional workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30 flex items-end p-8">
            <div className="text-white">
              <FaLock className="w-10 h-10 mb-4 opacity-90" />
              <h3 className="text-2xl font-semibold mb-2">Welcome Back</h3>
              <p className="text-gray-300 opacity-90">
                Secure access to your account and manage your leads efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaSignInAlt className="text-blue-600 w-6 h-6" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Account Login
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sign in to your professional dashboard
          </p>

          {error && (
            <p className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="john@company.com"
                    {...register("email", {
                      required: "Valid email address is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address",
                      },
                    })}
                    error={errors.email?.message}
                    className="w-full pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    error={errors.password?.message}
                    className="w-full pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 py-3 flex items-center justify-center"
              disabled={isSubmitting || loading}
            >
              {loading && (
                <img className="w-6 h-6 mr-2" src={spinner} alt="Loading..." />
              )}
              {isSubmitting || loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to our platform?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
