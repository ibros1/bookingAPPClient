import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import logoLogin from "../../../public/logoLogin.png";

// Assuming you have a register slice
import type { AppDispatch, RootState } from "@/redux/store";
import { ChangeToggle } from "../ui/theme";
import { BASE_API_URL } from "@/constants/base_url";
import { handleGoogleCallback } from "@/redux/slices/users/auth/login";
import { registerUserFn } from "@/redux/slices/users/auth/register";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

const RegisterForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  const registerReturnUrl = useMemo(
    () => `${window.location.origin}/register`,
    []
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const registerState = useSelector((state: RootState) => state.registerSlice); // Replace with your slice
  const logInState = useSelector((state: RootState) => state.loginSlice); // Replace with your slice

  // --- Backend health check ---
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    (async () => {
      try {
        const resp = await fetch(`${BASE_API_URL}/users/health`, {
          signal: controller.signal,
        });
        if (!mounted) return;
        setBackendStatus(resp.ok ? "online" : "offline");
      } catch {
        if (!mounted) return;
        setBackendStatus("offline");
      }
    })();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // --- Formik for register form ---
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup
        .string()
        .min(3, "Password must be at least 3 characters")
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(
          registerUserFn({
            email: values.email.toLowerCase(),
            password: values.password,
            confirmPassword: values.confirmPassword,
            isActive: true,
          })
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // --- Toast & navigation ---
  // --- Toasts & navigation based on login state ---
  useEffect(() => {
    // Only show error toast if there's an error
    if (logInState.error) {
      toast.dismiss();
      toast.error(logInState.error || DEFAULT_ERROR_MESSAGE);
      return;
    }

    // Check if login was successful
    if (logInState.data?.isSuccess && logInState.data?.user) {
      const displayName = logInState.data.user.name || "";
      toast.dismiss();
      toast.success(
        displayName ? `Welcome, ${displayName}!` : "Successfully logged in"
      );

      const redirectTo = (searchParams.get("redirect") as string) || "/";
      navigate(redirectTo);
    }
  }, [logInState.error, logInState.data, navigate, searchParams]);
  // --- Google OAuth callback ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      dispatch(handleGoogleCallback({ token, user: user }));
      params.delete("token");
      params.delete("user");
      const newSearch = params.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${newSearch ? "?" + newSearch : ""}`
      );
    }
  }, [dispatch]);

  // --- Google Register/Login button ---
  const handleGoogleRegister = () => {
    const url = `${BASE_API_URL}/users/auth/google?redirect_uri=${encodeURIComponent(
      registerReturnUrl
    )}`;
    window.location.href = url;
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-[#0A1128] transition-colors duration-300">
      <header className="w-full border-b border-gray-200 dark:border-gray-700">
        <div className="py-6 flex flex-col items-center">
          <img src={logoLogin} alt="Logo" className="w-[160px] mb-2" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transportation
          </h1>
        </div>
        <div className="mx-6 flex justify-start">
          <ChangeToggle />
        </div>
      </header>

      <div className="w-[95%] md:w-[60%] lg:w-[40%] xl:w-[32%] pb-8 pt-4 mb-16 mt-6 bg-white dark:bg-[#111A33] rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Sign up to get started.
          </CardDescription>
        </CardHeader>

        {backendStatus === "offline" && (
          <div className="mx-4 my-2 p-3 rounded bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm">
            Backend seems offline — some features may not work. Please try again
            later.
          </div>
        )}

        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                {...formik.getFieldProps("email")}
                className="border border-gray-300 dark:border-gray-600 py-4 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-600 text-sm">{formik.errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...formik.getFieldProps("password")}
                className="border border-gray-300 dark:border-gray-600 py-4 rounded-md focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 transition-all duration-200"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-600 text-sm">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                {...formik.getFieldProps("confirmPassword")}
                className="border border-gray-300 dark:border-gray-600 py-4 rounded-md focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 transition-all duration-200"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <Button
              type="submit"
              disabled={!formik.isValid || registerState.loading}
              className="w-full mt-2 bg-slate-900 dark:bg-white dark:text-black cursor-pointer dark:hover:bg-gray-200 py-4 font-semibold hover:bg-slate-800 text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
              {registerState.loading || !formik.isValid ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 animate-spin"
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
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Register"
              )}
            </Button>

            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 mt-6">
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            onClick={handleGoogleRegister}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>
        </CardFooter>
      </div>
    </div>
  );
};

export default RegisterForm;
