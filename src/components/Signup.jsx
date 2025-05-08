import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaBuilding } from "react-icons/fa";
import Button from "./Button";
import Input from "./Input";
import spinner from "/spinner.svg";
import authService from "../services/authService";
import {toast} from "react-hot-toast"
import extractErrorMessage from "../utils/extractErrorMessage"

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignup = (data) => {
    setLoading(true);
    setIsSubmitting(true);
    setError("");
    if (!data) {
      console.log("No data found");
    }
    authService
      .registerUser(data)
      .then((response) => {
        if (response.statusCode === 201) {
          toast.success("Account created successfully! Now you can login");
          navigate("/login");
        }
        setLoading(false);
        setError("");
      })
      .catch((error) => {
        toast.success(extractErrorMessage(error));
        setError(extractErrorMessage(error));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setIsSubmitting(false);
      });
  };

  const signupImageUrl =
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  return (
    <div className="bg-gray-50 mt-16 md:mt-20 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/2  relative bg-gray-100">
          <img
            src={signupImageUrl}
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30 flex items-end p-8">
            <div className="text-white">
              <FaBuilding className="w-10 h-10 mb-4 opacity-90" />
              <h3 className="text-2xl font-semibold mb-2">
                Join Our Professional Network
              </h3>
              <p className="text-gray-300 opacity-90">
                Register now to access our comprehensive lead management system
                and collaborate with your team.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-orange-100 p-3 rounded-full">
              <FaUserPlus className="text-orange-600 w-6 h-6" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3  ">
            Create Your Account
          </h2>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              {/* Name */}
              <div>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  label="Full Name"
                  {...register("name", { required: "Full name is required" })}
                  placeholder="John Doe"
                  error={errors.name?.message}
                  className="w-full"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  label="Work Email"
                  {...register("email", {
                    required: "Valid email address is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="john@company.com"
                  error={errors.email?.message}
                  className="w-full"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  label="Phone Number"
                  {...register("phone", {
                    required: "Valid 10-digit phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  placeholder="(123) 456-7890"
                  error={errors.phone?.message}
                  className="w-full"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  label="Password"
                  {...register("password", {
                    required: "Password must be at least 8 characters",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  className="w-full"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  {...register("role")}
                  className="text-gray-700
          w-full
          bg-white
          px-4
          py-2
          border
          border-gray-300
          rounded-md
          shadow-sm
          focus:outline-none
          focus:ring-1
          focus:ring-orange-300
          focus:border-orange-500
          transition duration-200"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 py-3 flex items-center justify-center "
              disabled={isSubmitting}
            >
              {loading && (
                <img className="w-6 h-6 mr-2" src={spinner} alt="Loading..." />
              )}{" "}
              {isSubmitting
                ? "Creating Account..."
                : "Create Professional Account"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-500 font-medium text-sm hover:underline"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
