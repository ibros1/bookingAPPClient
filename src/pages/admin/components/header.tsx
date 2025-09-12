import { Avatar } from "@/components/ui/avatar";
import type { RootState } from "@/redux/store";
import { Bell, Menu, Sun, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeToggle } from "@/components/ui/theme";

type AdminHeaderProps = {
  toggleSidebar: () => void;
};

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpenNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user)
    return (
      <div className="p-4 text-red-500 font-semibold">Please login first</div>
    );

  return (
    <header className="w-full flex items-center justify-between py-1 px-6  border-b bg-white dark:bg-[#101828]  dark:border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-6 lg:gap-0">
        <div
          className="bars py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-300 flex lg:hidden cursor-pointer"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          🚍 <span className="hidden lg:flex"> Transport Admin</span>
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Theme Toggle */}
        <ChangeToggle />

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setOpenNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          {openNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#101828] shadow-lg rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <Card className="w-full text-center dark:bg-[#101828]">
                <CardHeader>
                  <CardTitle className="flex justify-center items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-base">
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
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
          >
            <Avatar>
              <img
                src={user.profilePhoto || "/defaultImg.png"}
                alt={user.name || "User"}
              />
            </Avatar>
            <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300">
              {user.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                openProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#101828] shadow-lg rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <Link
                to="/dashboard/admin/profile"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                Profile
              </Link>
              <Link
                to="/dashboard/admin/settings"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                Settings
              </Link>
              <button
                onClick={() => navigate("/")}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
