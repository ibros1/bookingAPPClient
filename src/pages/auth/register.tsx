import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeToggle } from "@/components/ui/theme";
import { registerUserFn } from "@/redux/slices/users/auth/register";
import { type AppDispatch, type RootState } from "@/redux/store";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
const Register = () => {
  const registerState = useSelector((state: RootState) => state.registerSlice);

  const navigate = useNavigate();

  useEffect(() => {
    if (registerState.error) {
      toast.dismiss();
      toast.error(registerState.error);
      return;
    }
    if (registerState.loading) {
      toast.dismiss();
      toast.loading("registering....");

      return;
    }
    if (registerState.data.isSuccess) {
      toast.dismiss();
      toast.success("Registered your account successfully");
      navigate("/auth/login");
      return;
    }
  }, [registerState, navigate]);
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      phone: "",
      address: "",
      name: "",
      password: "",
      confirmPassword: "",
    },

    onSubmit: (values) => {
      const data = {
        phone: values.phone,
        address: values.address,
        name: values.name,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };
      console.log(data);

      dispatch(registerUserFn(data));
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .min(4, "Name should be atleast 4 characters")
        .required(),
      phone: yup
        .string()
        .length(12, "Phone number must be 12 digits (2526xxxxxxxx)")
        .required(),
      address: yup.string().required(),
      password: yup.string().min(6, "At least 6 characters").required(),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required(),
    }),
  });

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] px-4 bg-gray-50 dark:bg-gray-900">
      <form
        action=""
        className=" w-full md:w-[80%] lg:w-[30%]  border rounded-md p-8 flex flex-col gap-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="absolute top-3 left-3 mt-6 lg:mt-16">
          <ChangeToggle />
        </div>
        <h2 className="py-4  text-center font-bold text-xl lg:text-3xl">
          Register account
        </h2>
        <p className="-mt-6 mb-2 text-sm text-center text-gray-500 dark:text-gray-300">
          create account to access your own staff account!
        </p>
        <div className="name grid">
          <Input
            name="name"
            placeholder="Enter your name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm py-1 font-bold">
              {formik.errors.name}
            </p>
          )}
        </div>
        <div className="phoneNumber grid">
          <Input
            name="phone"
            placeholder="Enter your phone-number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm py-1 font-bold">
              {formik.errors.phone}
            </p>
          )}
        </div>

        <div className="password grid">
          <Input
            type="password"
            name="password"
            placeholder="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm py-1 font-bold">
              {formik.errors.password}
            </p>
          )}
        </div>

        <div className="grid">
          <Input
            type="password"
            name="confirmPassword"
            placeholder="confirm-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm py-1 font-bold">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="register">
          <Button
            type="submit"
            disabled={registerState.loading || !formik.isValid}
          >
            {" "}
            {registerState.loading ? "Registering..." : "Register"}{" "}
          </Button>
        </div>
        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm my-2">
          <span className="flex-1 border-b border-gray-300 dark:border-gray-600"></span>
          <span>OR</span>
          <span className="flex-1 border-b border-gray-300 dark:border-gray-600"></span>
        </div>

        {/* Register section */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
