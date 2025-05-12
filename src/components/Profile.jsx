import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Loading from "./Loading";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await authService.getUser();
      if (response.statusCode === 200) {
        setUser(response.data);
        reset({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await authService.updateAccountDetails(data);
      if (response.statusCode === 200) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        fetchUser();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      const response = await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.statusCode === 200) {
        toast.success("Password updated successfully!");
        setIsPasswordMode(false);
        reset();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-lg mx-auto mt-25 mb-10 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h2>
      {!editMode && !isPasswordMode && user && (
        <>
          <div className="mb-4">
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{user.name}</div>
            <div className="text-gray-500 dark:text-gray-300">{user.email}</div>
            <div className="text-gray-500 dark:text-gray-300">{user.phone}</div>
            <div className="text-gray-500 dark:text-gray-300 capitalize">Role: {user.role}</div>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsPasswordMode(true)}
            >
              Change Password
            </button>
          </div>
        </>
      )}
      {editMode && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              {...register("phone", { required: "Phone is required" })}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {isPasswordMode && (
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              {...register("currentPassword", { required: "Current password is required" })}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.currentPassword && <p className="text-xs text-red-600">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              {...register("newPassword", { required: "New password is required" })}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.newPassword && <p className="text-xs text-red-600">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmPassword", { required: "Please confirm new password" })}
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Change Password"}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => setIsPasswordMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
