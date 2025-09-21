import LoadingPages from "@/components/loading";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { data, loading } = useSelector(
    (state: RootState) => state.WhoAmiSlice
  );

  if (loading) return <LoadingPages message="Checking your access..." />;

  return data?.user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
