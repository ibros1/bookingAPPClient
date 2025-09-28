import LoadingPages from "@/components/loading";
import { WhoAmiFn } from "@/redux/slices/users/auth/me";
import { type AppDispatch, type RootState } from "@/redux/store";
import { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import UnablePage from "./unable";

export default function ProtectedAdminRoute({
  children,
  allowedRoles = ["ADMIN", "OFFICER", "BOOKER"],
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const {
    data: whoAmi,
    loading,
    error,
  } = useSelector((state: RootState) => state.WhoAmiSlice);
  const loginData = useSelector((state: RootState) => state.loginSlice.data);

  // Fetch current user on mount if token exists
  useEffect(() => {
    if (loginData?.token) {
      dispatch(WhoAmiFn());
    }
  }, [dispatch, loginData?.token]);

  // Show loader while fetching
  if (loading) return <LoadingPages message="Checking your access..." />;

  // If no token or user → redirect to login
  if (!loginData?.token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If WhoAmi fetched but no user → redirect to login

  // If WhoAmi fetched but no user → redirect to login
  if (!whoAmi?.user) {
    return <LoadingPages message="Verifying your session..." />;
  }

  // Check roles
  if (!allowedRoles.includes(whoAmi.user.role)) {
    return (
      <UnablePage message="You do not have permission. Please contact admin." />
    );
  }

  // ✅ Authorized
  return children;
}
