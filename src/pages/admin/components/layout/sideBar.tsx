import {
  Activity,
  BarChart3,
  Building,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Landmark,
  Map,
  MapPin,
  PlusCircle,
  PlusSquare,
  Receipt,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

// ✅ Icon map
const IconMap: Record<string, React.ElementType> = {
  Home,
  User,
  Users,
  Shield,
  PlusSquare,
  PlusCircle,
  FileText,
  Map,
  MapPin,
  BarChart3,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Receipt,
  Activity,
  Building,
  Landmark,
};

// ✅ Sidebar menu structure with role access
const navItems = [
  // ------------------- ADMIN -------------------
  {
    title: "Dashboard",
    icon: "Home",
    roles: ["ADMIN", "OFFICER", "BOOKER"],
    children: [
      {
        title: "Home",
        link: "/dashboard/admin",
        icon: "Home",
        roles: ["ADMIN", "OFFICER", "BOOKER"],
      },
    ],
  },
  {
    title: "User Management",
    icon: "Users",
    roles: ["ADMIN"],
    children: [
      {
        title: "All Users",
        link: "/dashboard/admin/users",
        icon: "Users",
        roles: ["ADMIN"],
      },
      {
        title: "Create User",
        link: "/dashboard/admin/users/create",
        icon: "User",
        roles: ["ADMIN"],
      },
      {
        title: "Roles & Permissions",
        link: "/dashboard/admin/users/roles",
        icon: "Shield",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Bookings",
    icon: "ClipboardList",
    roles: ["ADMIN", "OFFICER", "BOOKER"],
    children: [
      {
        title: "All Bookings",
        link: "/dashboard/admin/bookings",
        icon: "ClipboardList",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Create Booking",
        link: "/dashboard/admin/bookings/create",
        icon: "PlusSquare",
        roles: ["ADMIN", "BOOKER"],
      },
      {
        title: "My Bookings",
        link: "/dashboard/admin/booker/my-bookings",
        icon: "ClipboardCheck",
        roles: ["BOOKER"],
      },
    ],
  },
  {
    title: "Routes & Addresses",
    icon: "Landmark",
    roles: ["ADMIN", "OFFICER"],
    children: [
      {
        title: "All Routes",
        link: "/dashboard/admin/routes",
        icon: "Map",
        roles: ["ADMIN"],
      },
      {
        title: "Add Route",
        link: "/dashboard/admin/routes/create",
        icon: "PlusCircle",
        roles: ["ADMIN"],
      },
      {
        title: "Addresses",
        link: "/dashboard/admin/addresses",
        icon: "MapPin",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Add Address",
        link: "/dashboard/admin/addresses/create",
        icon: "PlusCircle",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Reports",
    icon: "BarChart3",
    roles: ["BOOKER"],
    children: [
      {
        title: "Booking Reports",
        link: "/dashboard/admin/reports/booker/bookings",
        icon: "FileText",
        roles: ["BOOKER"],
      },
    ],
  },
  {
    title: "Hotels",
    icon: "Building",
    roles: ["ADMIN", "OFFICER"],
    children: [
      {
        title: "All Hotels",
        link: "/dashboard/admin/hotels",
        icon: "Building",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Create Hotel",
        link: "/dashboard/admin/hotels/create",
        icon: "PlusSquare",
        roles: ["ADMIN", "OFFICER"],
      },

      {
        title: "Hotel Reports",
        link: "/dashboard/admin/hotels/report",
        icon: "FileText",
        roles: ["ADMIN", "OFFICER"],
      },
    ],
  },
  {
    title: "Reports",
    icon: "BarChart3",
    roles: ["ADMIN", "OFFICER"],
    children: [
      {
        title: "Booking Reports",
        link: "/dashboard/admin/reports/bookings",
        icon: "FileText",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Invoice Reports",
        link: "/dashboard/admin/reports/invoices",
        icon: "Receipt",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Activity Logs",
    icon: "Activity",
    roles: ["ADMIN"],
    children: [
      {
        title: "Logs",
        link: "/dashboard/admin/logs",
        icon: "Activity",
        roles: ["ADMIN"],
      },
    ],
  },

  // ------------------- OFFICER -------------------
  {
    title: "Bookers",
    icon: "Users",
    roles: ["OFFICER"],
    children: [
      {
        title: "Bookers by Address",
        link: "/dashboard/admin/officer/bookers",
        icon: "Users",
        roles: ["OFFICER"],
      },
    ],
  },
];

type SideBarProps = {
  isOpen: boolean;
  closeSidebar: () => void;
};

const SideBar = ({ isOpen, closeSidebar }: SideBarProps) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const userRole = useSelector(
    (state: RootState) => state.loginSlice.data?.user.role
  ) as string;

  useEffect(() => {
    const active = navItems.find((item) =>
      item.children?.some((sub) => sub.link === location.pathname)
    );
    if (active) setOpenMenu(active.title);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 lg:top-[41px] lg:pt-0 lg:mt-4 left-0 h-full w-64 bg-white dark:bg-[#0a1126] dark:border-r border-gray-500 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header with close button (mobile only) */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            📋 Booking App
          </h2>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Menu items */}
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          <ul className="space-y-3">
            {navItems
              .filter((item) => item.roles.includes(userRole))
              .map((item, i) => {
                const isOpenMenu = openMenu === item.title;
                const ParentIcon = IconMap[item.icon] || Home;

                return (
                  <li key={i}>
                    <button
                      onClick={() =>
                        item.children ? toggleMenu(item.title) : closeSidebar()
                      }
                      className={`flex justify-between items-center w-full px-3 py-2 text-sm rounded-md ${
                        isOpenMenu
                          ? "text-gray-900 dark:text-gray-100 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ParentIcon
                          className={`w-4 h-4 ${
                            isOpenMenu
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        {item.title}
                      </span>
                      {item.children && (
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                            isOpenMenu ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {item.children && (
                      <div
                        ref={(el) => (submenuRefs.current[item.title] = el)}
                        style={{
                          maxHeight: isOpenMenu
                            ? `${
                                submenuRefs.current[item.title]?.scrollHeight
                              }px`
                            : "0px",
                          transition: "max-height 0.35s ease-in-out",
                        }}
                        className="ml-4 mt-1 border-l border-gray-200 dark:border-gray-700 pl-2 overflow-hidden"
                      >
                        <ul className="space-y-1">
                          {item.children
                            .filter((sub) => sub.roles.includes(userRole))
                            .map((sub, j) => {
                              const SubIcon = IconMap[sub.icon] || Home;
                              const isActive = location.pathname === sub.link;
                              return (
                                <li key={j}>
                                  <Link
                                    to={sub.link}
                                    onClick={closeSidebar}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                      isActive
                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 font-semibold"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    <SubIcon className="w-4 h-4" />
                                    <span className="text-xs">{sub.title}</span>
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
