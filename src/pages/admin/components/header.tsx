import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeToggle } from "@/components/ui/theme";
import type { RootState } from "@/redux/store";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "./sideBar";

const AdminHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setOpenProfile(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setOpenNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="p-4 text-red-500 font-semibold">Please login first</div>
    );
  }

  return (
    <>
      <header className="w-full flex items-center justify-between py-2 px-6 border-b bg-white dark:bg-[#101828] dark:border-gray-700">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            🚍 Transport Admin
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <ChangeToggle />
          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setOpenNotifications((p) => !p)}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            {openNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#101828] shadow-lg rounded-md border dark:border-gray-700 z-50">
                <Card className="w-full text-center dark:bg-[#101828]">
                  <CardHeader>
                    <CardTitle className="flex justify-center items-center gap-2 text-lg">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      You have no notifications yet.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setOpenProfile((p) => !p)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Avatar>
                <img
                  src={user.profilePhoto || "/defaultImg.png"}
                  alt={user.name || "User"}
                />
              </Avatar>
              <span className="hidden md:block font-medium">{user.name}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openProfile ? "rotate-180" : ""
                }`}
              />
            </button>
            {openProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#101828] shadow-lg rounded-md border dark:border-gray-700 z-50">
                <Link
                  to="/dashboard/admin/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/admin/settings"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Settings
                </Link>
                <button
                  onClick={() => navigate("/")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <SideBar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default AdminHeader;
