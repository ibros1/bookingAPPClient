import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.loginSlice.data?.user
  );

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
