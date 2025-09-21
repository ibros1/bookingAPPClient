import LoadingPages from "@/components/loading";
import { WhoAmiFn } from "@/redux/slices/users/whoami";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import ForbiddenPage from "./forbidden";

export default function AdminProtected({
  children,
  allowedRoles = ["ADMIN"],
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const whoAmi = useSelector((state: RootState) => state.WhoAmiSlice.data);
  const loading = useSelector((state: RootState) => state.WhoAmiSlice.loading);

  useEffect(() => {
    dispatch(WhoAmiFn());
  }, [dispatch]);

  if (loading)
    return <LoadingPages message="Checking your confidentiality..." />;

  if (allowedRoles.includes(whoAmi.user?.role || "")) {
    return children;
  } else {
    return <ForbiddenPage />;
  }
}
