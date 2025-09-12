import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Button } from "../ui/button";

import { resetLoginState } from "@/redux/slices/users/auth/login";
import type { RootState } from "@/redux/store";
import defaultProfile from "../../../public/defaultImg.png";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Home, MapPin, Book, Settings, LogOut } from "lucide-react";
import type { JSX } from "react";

interface ProfileLink {
  linkTitle: string;
  to: string;
  icon: JSX.Element;
}

const AuthSection = () => {
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = loginState.data?.user;
  const isLoggedIn = Boolean(user);

  const logoutHandler = () => {
    dispatch(resetLoginState());
    localStorage.removeItem("user_data");
    cookieStore.delete("auth_token");
    location.reload();
  };

  if (!isLoggedIn) {
    return (
      <div className="flex gap-3 items-center">
        <Link
          to="/login"
          className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="hidden lg:inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const fullName = user?.name;
  const profilePhoto = user.profilePhoto ? user.profilePhoto : defaultProfile;

  const links: ProfileLink[] = [
    ...(user?.role === "ADMIN"
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
        <div className="flex items-center gap-3 px-3 py-1 rounded-full hover:shadow-lg transition cursor-pointer bg-gray-50 dark:bg-[#020618] ring-1 ring-gray-200 dark:ring-gray-700">
          <Avatar className="w-10 h-10">
            {profilePhoto ? (
              <AvatarImage
                src={profilePhoto}
                alt="Profile"
                className="w-full"
              />
            ) : (
              <AvatarImage
                src={defaultProfile}
                alt="Profile"
                className="shadow-xl rounded-full w-full"
              />
            )}

            {/* <AvatarFallback>{defaultProfile}</AvatarFallback> */}
          </Avatar>
          <span className="hidden md:inline font-medium text-gray-900 dark:text-gray-100 truncate">
            {fullName}
          </span>
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
          <Avatar className="w-12 h-12 ring-2 ring-blue-500">
            <img src={profilePhoto} alt="Profile" />
          </Avatar>
          <div className="truncate">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {fullName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
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
