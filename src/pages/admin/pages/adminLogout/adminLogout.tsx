"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/users/auth/login"; // adjust path
import toast, { Toaster } from "react-hot-toast";

const AdminLogout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    if (loggingOut) return; // prevent multiple clicks
    setLoggingOut(true);

    // Wait 3 seconds, then finish logout
    setTimeout(() => {
      // Dispatch logout action
      dispatch(logout());
      localStorage.removeItem("user_data");
      toast.dismiss();
      toast.success("You have been logged out!");
      navigate("/auth/login");
    }, 3000);
  };

  const handleCancel = () => {
    navigate("/dashboard/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white dark:bg-gray-800 p-10 rounded-md shadow-sm text-center w-full max-w-md">
        {!loggingOut ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Are you sure you want to logout?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You will be logged out from your account and redirected to the
              login page.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-red-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Logging out...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait a few seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogout;
