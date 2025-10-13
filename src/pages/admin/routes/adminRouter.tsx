import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Footer from "@/components/footer";
import LoadingPages from "@/components/loading";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import SideBar from "../components/layout/sideBar";
import UnablePage from "./unable";
import AdminHeader from "../components/layout/header";

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
      <aside
        className={`fixed top-0 left-0  w-80 h-screen bg-white dark:bg-gray-800 shadow-sm transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:flex z-50`}
      >
        <SideBar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-80">
        {/* Header */}
        <header className="w-full pl-0 lg:pl-80 lg:z-50 lg:fixed  top-0 left-0">
          <AdminHeader toggleSidebar={toggleSidebar} />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 lg:pt-16 w-screen  lg:w-full">
          <div className="min-h-screen ">
            <Outlet />
          </div>
          <footer className="w-full">
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminRouter;
