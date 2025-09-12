import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthRoute = () => {
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);
  const location = useLocation();

  if (user) return <Navigate to="/" replace />;

  // Allow only /login and /register
  if (location.pathname !== "/login" && location.pathname !== "/register") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
