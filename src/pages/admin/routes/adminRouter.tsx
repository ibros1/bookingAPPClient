import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import LoadingPages from "@/components/loading";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import AdminHeader from "../components/layout/header";
import SideBar from "../components/layout/sideBar";
import UnablePage from "./unable";

const AdminRouter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userState = useSelector((state: RootState) => state.loginSlice);
  const user = userState.data?.user;
  const allowedRoles = ["ADMIN", "OFFICER", "BOOKER"];
  const navigate = useNavigate();

  // redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (userState.loading) return <LoadingPages />;

  // role validation
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <UnablePage message="You do not have permission. Please contact the admin." />
    );
  }

  return (
    <div className="flex h-screen dark:bg-slate-950 text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}

      <SideBar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="w-full ml-0 lg:ml-80  overflow-auto">
        {/* Header */}
        <div className="w-full   top-0 left-0">
          <AdminHeader toggleSidebar={toggleSidebar} />
        </div>

        {/* Scrollable content */}

        <div className="flex-1 min-h-screen flex flex-col ">
          <main className="flex-1 overflow-y-auto dark:bg-[#091025]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminRouter;
