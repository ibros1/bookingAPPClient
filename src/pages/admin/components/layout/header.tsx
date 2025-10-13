import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeDark } from "@/components/ui/darkToggle";
import { logout } from "@/redux/slices/users/auth/login";
import { type AppDispatch, type RootState } from "@/redux/store";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

type AdminHeaderProps = {
  toggleSidebar: () => void;
};

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);
  const dispatch = useDispatch<AppDispatch>();

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

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    navigate("/auth/login");
    dispatch(logout());
  };

  return (
    <header className="w-full flex items-center justify-between   py-3 px-6 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700 ">
      {/* Left: Logo & Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition lg:hidden"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
          Dashboard
        </h1>
        {/* User Role */}

        {user.role === "ADMIN" ? (
          <span className="bg-green-400 text-white font-semibold px-3 py-1 border rounded-md text-sm">
            {" "}
            {user.role}{" "}
          </span>
        ) : (
          <span className="bg-amber-400  text-white font-semibold px-3 py-1 border rounded-xl text-sm">
            {" "}
            {user.role}
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <ChangeDark />

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setOpenNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-200" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          {openNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#101828] shadow-lg rounded-md border dark:border-gray-700 z-50">
              <Card className="w-full text-center dark:bg-[#101828]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg text-gray-800 dark:text-white">
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

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Avatar>
              <img
                src={user.profilePhoto || "/defaultImg.png"}
                alt={user.name || "User"}
              />
            </Avatar>
            <span className="hidden md:block font-medium text-gray-800 dark:text-white">
              {user.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform text-gray-600 dark:text-gray-200 ${
                openProfile ? "rotate-180" : ""
              }`}
            />
          </button>
          {openProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#101828] shadow-lg rounded-md border dark:border-gray-700 z-50">
              <Link
                to="/dashboard/admin/profile"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                Profile
              </Link>
              <Link
                to="/dashboard/admin/settings"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
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
