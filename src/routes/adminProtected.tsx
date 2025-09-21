import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/redux/store";
import LoadingPages from "@/components/loading";

const AdminProtected = () => {
  const { data: user, loading } = useSelector(
    (state: RootState) => state.WhoAmiSlice
  );

  if (loading) {
    return <LoadingPages message="Checking admin access..." />;
  }

  if (!user?.user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtected;
