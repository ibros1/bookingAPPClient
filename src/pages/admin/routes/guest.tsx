import type { RootState } from "@/redux/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function GuestRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isLoggedIn = useSelector(
    (state: RootState) => state.loginSlice.data?.user
  );

  if (isLoggedIn) {
    return (
      <Navigate
        to="/dashboard/admin"
        state={{ from: location, info: "Already logged in" }}
        replace
      />
    );
  }

  return children;
}
