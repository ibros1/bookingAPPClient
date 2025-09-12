import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminFooter from "../components/footer";
import AdminHeader from "../components/header";
import SideBar from "../components/sideBar";

const AdminRouter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header (fixed top) */}
      <header className="w-full fixed top-0 left-0 z-50">
        <AdminHeader toggleSidebar={toggleSidebar} />
      </header>

      <div className="flex ">
        {/* Sidebar */}
        <aside
          className={`fixed top-12.5 left-0 z-30 w-64 h-screen bg-white shadow-sm transition-transform transform
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 lg:flex`}
        >
          <SideBar closeSidebar={() => setSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 overflow-y-auto">
          <div className="min-h-screen pt-13">
            <Outlet />
          </div>
          <footer className="w-full mt-6">
            <AdminFooter />
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminRouter;
