import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeToggle } from "@/components/ui/theme";
import ButtonSpinner from "@/components/spinnser";
import { loginFn } from "@/redux/slices/users/auth/login";
import type { AppDispatch, RootState } from "@/redux/store";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.loginSlice
  );

  // Handle toast and navigation
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem("just_logged_in");

    if (error) {
      toast.dismiss();
      toast.error(error);
    }

    if (data?.isSuccess && !justLoggedIn) {
      toast.dismiss();

      sessionStorage.setItem("just_logged_in", "true"); // only for current tab session
      localStorage.setItem("user_data", JSON.stringify(data));
      navigate("/dashboard/admin");
    }
  }, [error, data, navigate]);

  // Clear the session flag on component mount so it only triggers once
  useEffect(() => {
    sessionStorage.removeItem("just_logged_in");
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: { phone: "", password: "" },
    validationSchema: yup.object({
      phone: yup
        .string()
        .min(10, "Phone must be 10 digits like: 06xxxxxxxx")
        .max(10, "Phone must be 10 digits like: 06xxxxxxxx")
        .required("Phone number is required"),
      password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(loginFn({ phone: values.phone, password: values.password }));
      toast.success("Logged in successfully");
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] px-4 bg-gray-50 dark:bg-gray-900">
      <form
        className="w-full md:w-[80%] lg:w-[30%] shadow-sm border rounded-md p-8 flex flex-col gap-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="absolute top-3 left-3 mt-16">
          <ChangeToggle />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="font-bold text-2xl lg:text-3xl text-gray-800 dark:text-gray-100">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Login with your credentials to access your account
          </p>
        </div>

        {/* Phone Input */}
        <div className="grid gap-1">
          <Input
            name="phone"
            placeholder="Phone number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm font-semibold">
              {formik.errors.phone}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="grid gap-1">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm font-semibold">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          disabled={loading || !formik.isValid}
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 disabled:bg-gray-500 w-full dark:bg-white dark:text-slate-800 text-white py-2 font-semibold rounded-md"
        >
          {loading ? <ButtonSpinner /> : "Login"}
        </Button>

        {/* OR separator */}
        <div className="flex items-center gap-2 text-gray-400 text-sm my-2">
          <span className="flex-1 border-b border-gray-300 dark:border-gray-600"></span>
          <span>OR</span>
          <span className="flex-1 border-b border-gray-300 dark:border-gray-600"></span>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
