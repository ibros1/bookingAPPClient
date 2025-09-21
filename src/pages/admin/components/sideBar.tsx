import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserPlus,
  Users,
  ShieldCheck,
  Car,
  Bus,
  CalendarDays,
  CreditCard,
  BarChart3,
  FileText,
  DollarSign,
  CheckCircle,
  Truck,
  BookOpen,
  ClipboardList,
  Activity,
  CarFront,
  PlusSquare,
  LifeBuoy,
  CircleFadingPlus,
  Map,
  Rows,
  MapPinned,
  Route,
  CalendarPlus,
  ChevronDown,
  Receipt,
  ClipboardCheck,
} from "lucide-react";

// ✅ Icon map for dynamic rendering
const IconMap = {
  HomeIcon,
  UserPlus,
  Users,
  ShieldCheck,
  Car,
  Bus,
  CalendarDays,
  CreditCard,
  BarChart3,
  FileText,
  DollarSign,
  CheckCircle,
  Truck,
  BookOpen,
  ClipboardList,
  Activity,
  CarFront,
  PlusSquare,
  LifeBuoy,
  CircleFadingPlus,
  Map,
  Rows,
  MapPinned,
  Route,
  CalendarPlus,
  Receipt,
  ClipboardCheck,
  ChevronDown,
};

// ✅ Sidebar menu structure
export const navItems = [
  {
    title: "Dashboard",
    icon: "HomeIcon",
    children: [{ title: "Home", link: "/dashboard/admin/", icon: "Home" }],
  },

  {
    title: "User Management",
    icon: "Users",
    children: [
      { title: "All Users", link: "/dashboard/admin/users", icon: "Users" },
      {
        title: "Create User",
        link: "/dashboard/admin/users/create",
        icon: "UserPlus",
      },
      {
        title: "Roles & Permissions",
        link: "/dashboard/admin/users/roles",
        icon: "ShieldCheck",
      },
    ],
  },

  {
    title: "Vehicles Management",
    icon: "Car",
    children: [
      { title: "All Vehicles", link: "/dashboard/admin/vehicles", icon: "Car" },
      {
        title: "Create Vehicle",
        link: "/dashboard/admin/vehicle/new",
        icon: "PlusSquare",
      },
      {
        title: "Vehicle Report",
        link: "/dashboard/admin/vehicles/reports",
        icon: "FileText",
      },
    ],
  },

  {
    title: "Routes Management",
    icon: "Map",
    children: [
      {
        title: "All Routes",
        link: "/dashboard/admin/routes",
        icon: "MapPinned",
      },
      {
        title: "Create Route",
        link: "/dashboard/admin/routes/create",
        icon: "Route",
      },
      {
        title: "Routes Report",
        link: "/dashboard/admin/routes/reports",
        icon: "BarChart3",
      },
    ],
  },

  {
    title: "Rides Management",
    icon: "Truck",
    children: [
      { title: "All Rides", link: "/dashboard/admin/rides", icon: "CarFront" },
      {
        title: "Create Ride",
        link: "/dashboard/admin/rides/create",
        icon: "CalendarPlus",
      },
      {
        title: "Rides Report",
        link: "/dashboard/admin/rides/reports",
        icon: "ClipboardList",
      },
    ],
  },

  {
    title: "Bookings Management",
    icon: "CalendarDays",
    children: [
      {
        title: "All Bookings",
        link: "/dashboard/admin/bookings",
        icon: "CalendarDays",
      },
      {
        title: "Booking Report",
        link: "/dashboard/admin/bookings/reports",
        icon: "ClipboardCheck",
      },
    ],
  },

  {
    title: "Payments Management",
    icon: "CreditCard",
    children: [
      {
        title: "All Payments",
        link: "/dashboard/admin/payments",
        icon: "DollarSign",
      },
      {
        title: "Payments Report",
        link: "/dashboard/admin/payments/reports",
        icon: "Receipt",
      },
    ],
  },

  {
    title: "Support & Reports",
    icon: "LifeBuoy",
    children: [
      {
        title: "Support Tickets",
        link: "/dashboard/admin/support",
        icon: "LifeBuoy",
      },
      {
        title: "System Activity",
        link: "/dashboard/admin/system/activity",
        icon: "Activity",
      },
    ],
  },
];

interface SideBarProps {
  closeSidebar?: () => void;
}

export default function SideBar({ closeSidebar }: SideBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // ✅ Automatically open the active menu group
  useEffect(() => {
    const active = navItems.find((item) =>
      item.children?.some((sub) => sub.link === location.pathname)
    );
    if (active) setOpenMenu(active.title);
  }, [location.pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  return (
    <div className="w-full bg-white dark:bg-[#101828] dark:border-r min-h-screen py-8 px-2 dark:border-gray-700 overflow-y-auto scrollbar-none">
      <ul className="space-y-3">
        {navItems.map((item, i) => {
          const isOpen = openMenu === item.title;
          const ParentIcon = IconMap[item.icon] || HomeIcon;

          return (
            <li key={i}>
              {/* ─── Parent Menu Item ───────────────────────────── */}
              <button
                onClick={() =>
                  item.children ? toggleMenu(item.title) : closeSidebar?.()
                }
                className={`flex justify-between items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  isOpen
                    ? "text-gray-900 dark:text-gray-100 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ParentIcon
                    className={`w-4 h-4 ${
                      isOpen
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  <span className={isOpen ? "font-semibold" : "font-medium"}>
                    {item.title}
                  </span>
                </span>

                {item.children && (
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {item.children && (
                <div
                  ref={(el) => (submenuRefs.current[item.title] = el)}
                  style={{
                    maxHeight: isOpen
                      ? `${submenuRefs.current[item.title]?.scrollHeight}px`
                      : "0px",
                    transition: "max-height 0.35s ease-in-out",
                  }}
                  className="ml-4 mt-1 border-l border-gray-200 dark:border-gray-700 pl-2 overflow-hidden"
                >
                  <ul className="space-y-1">
                    {item.children.map((sub, j) => {
                      const SubIcon = IconMap[sub.icon] || HomeIcon;
                      const isActive = location.pathname === sub.link;

                      return (
                        <li key={j}>
                          <Link
                            to={sub.link}
                            onClick={closeSidebar}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                              isActive
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 font-semibold"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                            }`}
                          >
                            <SubIcon
                              className={`w-4 h-4 ${
                                isActive
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                            <span className="text-[12px]">{sub.title}</span>
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
      <div className="py-16" />
    </div>
  );
}
