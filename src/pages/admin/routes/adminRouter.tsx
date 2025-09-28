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

  // Check role
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <UnablePage message="You do not have permission. Please contact the admin." />
    );
  }

  return (
    <div className="  flex h-screen text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full bg-white dark:bg-gray-800 shadow-sm transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:flex`}
      >
        <SideBar isOpen closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        {/* Header */}
        <header className="w-full fixed top-0 left-0 z-50">
          <AdminHeader toggleSidebar={toggleSidebar} />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 pt-14 w-screen lg:w-full">
          <div className="min-h-screen">
            <Outlet />
          </div>
          {/* Footer */}
          <footer className="w-full ">
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminRouter;
