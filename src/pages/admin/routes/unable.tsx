import LoadingPages from "@/components/loading";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type ForbiddenProps = {
  message?: string;
};

const UnablePage = ({ message }: ForbiddenProps) => {
  const logoutHandler = () => {
    localStorage.removeItem("user_data");
  };

  const isAllowed = useSelector(
    (state: RootState) => state.WhoAmiSlice.data?.user
  );
  const userState = useSelector((state: RootState) => state.WhoAmiSlice);
  const allowedRoles = ["ADMIN", "OFFICER", "BOOKER"];

  if (!isAllowed) {
    return <Navigate to="/auth/login" />;
  }

  if (!allowedRoles.includes(isAllowed.role)) {
    setTimeout(() => {
      localStorage.removeItem("user_data");
      location.reload();
      <Navigate to="/auth/login" />;
    }, 10000);
  }
  if (userState.loading)
    return <LoadingPages message="Checking your access..." />;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
      <p className="mt-4 text-gray-700  pb-4">
        {message ??
          "Access denied. Please contact the administrator to become the staff. please logout and re-login when admin gives you staff role"}
      </p>
      <div className="">
        {" "}
        <Button variant={"destructive"} onClick={logoutHandler}>
          Logout
        </Button>{" "}
      </div>
    </div>
  );
};

export default UnablePage;
