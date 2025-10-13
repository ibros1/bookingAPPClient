import LoadingPages from "@/components/loading";
import { WhoAmiFn } from "@/redux/slices/users/auth/me";
import { logout } from "@/redux/slices/users/auth/login";
import { type AppDispatch, type RootState } from "@/redux/store";
import { useEffect, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import UnablePage from "./unable";
import toast from "react-hot-toast";

export default function ProtectedAdminRoute({
  children,
  allowedRoles = ["ADMIN", "OFFICER", "BOOKER"],
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [toastShown, setToastShown] = useState(false); // 👈 prevent repeat toasts

  const {
    data: whoAmi,
    loading,
    error,
  } = useSelector((state: RootState) => state.WhoAmiSlice);
  const loginData = useSelector((state: RootState) => state.loginSlice.data);

  // ✅ Fetch current user on mount if token exists
  useEffect(() => {
    if (loginData?.token) {
      dispatch(WhoAmiFn());
    }
  }, [dispatch, loginData?.token]);

  // ✅ Handle WhoAmi error safely (only show toast once)
  useEffect(() => {
    if (error && !toastShown) {
      toast.error("Session expired or network error. Please log in again.", {
        id: "session-error", // prevent duplicates
        duration: 3000,
      });

      localStorage.removeItem("user_data");
      console.error("WhoAmi error:", error);
      dispatch(logout());
      setToastShown(true);
      setShouldRedirect(true);
    }
  }, [error, dispatch, toastShown]);

  // ✅ Handle missing token
  useEffect(() => {
    if (!loginData?.token && !toastShown) {
      toast.error("Please log in to continue.", {
        id: "login-required",
        duration: 3000,
      });
      dispatch(logout());
      setToastShown(true);
      setShouldRedirect(true);
    }
  }, [loginData?.token, dispatch, toastShown]);

  // ✅ Cleanup to dismiss all toasts after unmount
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  // ✅ Redirect after updates
  if (shouldRedirect) {
    return (
      <Navigate
        to="/auth/login"
        state={{
          from: location,
          error: "Session expired. Please log in again.",
        }}
        replace
      />
    );
  }

  // ✅ Show loader while fetching
  if (loading) {
    return <LoadingPages message="Checking your access..." />;
  }

  // ✅ Wait for user info if still verifying
  if (!whoAmi?.user) {
    return <LoadingPages message="Verifying your session..." />;
  }

  // ✅ Role check
  if (!allowedRoles.includes(whoAmi.user.role)) {
    return (
      <UnablePage message="You do not have permission. Please contact admin." />
    );
  }

  // ✅ Authorized → render children
  return children;
}
