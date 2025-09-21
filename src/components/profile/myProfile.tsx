import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

import { resetLoginState } from "@/redux/slices/users/auth/login";
import { type AppDispatch, type RootState } from "@/redux/store";
import Cookies from "js-cookie";
import { Book, Home, LogOut, MapPin, Settings } from "lucide-react";
import type { JSX } from "react";
import LoadingPages from "../loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logOutUserFn } from "@/redux/slices/users/auth/logout";

interface ProfileLink {
  linkTitle: string;
  to: string;
  icon: JSX.Element;
}

const AuthSection = () => {
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = loginState.data?.user;
  const isLoggedIn = Boolean(user);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, dispatch]);

  if (!user) return null;
  if (loginState.loading)
    return <LoadingPages message="Checking your access..." />;

  const logoutHandler = async () => {
    try {
      await dispatch(logOutUserFn()).unwrap(); // ensures action completes
      dispatch(resetLoginState());
      localStorage.removeItem("user_data");
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");
      navigate("/login");
      location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fullName = user.name;
  const profilePhoto = user.profilePhoto || "/defaultImg.png";

  const links: ProfileLink[] = [
    ...(user.role === "ADMIN"
      ? [
          {
            linkTitle: "Dashboard",
            to: "/dashboard/admin",
            icon: <Home className="w-4 h-4" />,
          },
        ]
      : []),
    {
      linkTitle: "Routes",
      to: "/routes",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      linkTitle: "Bookings",
      to: "/bookings",
      icon: <Book className="w-4 h-4" />,
    },
    {
      linkTitle: "Settings",
      to: "/my-settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const ProfilePopupLink = ({ linkTitle, to, icon }: ProfileLink) => (
    <DropdownMenuItem
      className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-[#11132b] rounded-lg cursor-pointer transition"
      onClick={() => navigate(to)}
    >
      {icon}
      <span className="truncate">{linkTitle}</span>
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 px-2 hover:shadow-md transition duration-700 rounded-md cursor-pointer  dark:bg-[#020618]  dark:ring-gray-700">
          <span className="hidden md:inline font-medium text-gray-900 dark:text-gray-100 truncate">
            {fullName}
          </span>
          <img
            src={profilePhoto}
            alt="Profile"
            referrerPolicy="no-referrer"
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 bg-white dark:bg-[#020618] rounded-xl shadow-xl p-3 border border-gray-200 dark:border-gray-700"
        align="end"
      >
        {/* Profile Header */}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#11132b] transition cursor-pointer"
          onClick={() => navigate("/my-profile")}
        >
          <img
            src={profilePhoto}
            alt="Profile"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full ring-2 ring-blue-500 object-cover"
          />
          <div className="truncate">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {fullName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 border-gray-200 dark:border-gray-700" />

        {/* Navigation Links */}
        <DropdownMenuLabel className="px-4 pt-1 text-gray-500 dark:text-gray-400 text-xs">
          Navigation
        </DropdownMenuLabel>
        <div className="flex flex-col gap-1">
          {links.map((item, idx) => (
            <ProfilePopupLink key={idx} {...item} />
          ))}
        </div>

        <DropdownMenuSeparator className="my-2 border-gray-200 dark:border-gray-700" />

        {/* Logout */}
        <Button
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 font-semibold rounded-lg py-2 transition"
          onClick={logoutHandler}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthSection;
