import type { RootState } from "@/redux/store";
import {
  Activity,
  BarChart2,
  BarChart3,
  Building,
  CalendarDays,
  CalendarPlus,
  CheckSquare,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Landmark,
  List,
  ListIcon,
  LogOutIcon,
  Map,
  MapPin,
  PlaySquareIcon,
  PlusCircle,
  PlusSquare,
  Receipt,
  Shield,
  User,
  UserPlus,
  Users,
  WorkflowIcon,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

// 🔹 Icon Map
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
  LogOutIcon,
  CalendarPlus,
  ClipboardList,
  ListIcon,
  PlaySquareIcon,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Receipt,
  Activity,
  Building,
  List,
  UserPlus,
  CheckSquare,
  BarChart2,
  WorkflowIcon,
  Landmark,
};

// 🔹 Navigation Items
const navItems = [
  {
    title: "Dashboard",
    icon: "Home",
    roles: ["ADMIN", "OFFICER", "BOOKER"],
    children: [
      {
        title: "Home",
        link: "/dashboard/admin",
        roles: ["ADMIN", "OFFICER", "BOOKER"],
      },
    ],
  },
  {
    title: "User Management",
    icon: "Users",
    roles: ["ADMIN"],
    children: [
      { title: "All Users", link: "/dashboard/admin/users", roles: ["ADMIN"] },
      {
        title: "Create User",
        link: "/dashboard/admin/users/create",
        roles: ["ADMIN"],
      },
      {
        title: "Roles & Permissions",
        link: "/dashboard/admin/users/roles",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Bookings & Rides",
    icon: "ClipboardList",
    roles: ["ADMIN", "OFFICER", "BOOKER"],
    children: [
      {
        title: "All Bookings",
        link: "/dashboard/admin/bookings",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Create Booking",
        link: "/dashboard/admin/bookings/create",
        roles: ["ADMIN", "BOOKER"],
      },
      { title: "All Rides", link: "/dashboard/admin/rides", roles: ["ADMIN"] },
      {
        title: "My Bookings",
        link: "/dashboard/admin/booker/my-bookings",
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
        roles: ["ADMIN"],
      },
      {
        title: "Add Route",
        link: "/dashboard/admin/routes/create",
        roles: ["ADMIN"],
      },
      {
        title: "Addresses",
        link: "/dashboard/admin/addresses",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Add Address",
        link: "/dashboard/admin/addresses/create",
        roles: ["ADMIN"],
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
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Create Hotel",
        link: "/dashboard/admin/hotels/create",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Hotel Reports",
        link: "/dashboard/admin/hotels/report",
        roles: ["ADMIN", "OFFICER"],
      },
    ],
  },
  {
    title: "Employees",
    icon: "Users",
    roles: ["ADMIN"],
    children: [
      {
        title: "All Employees",
        link: "/dashboard/admin/employees",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Create Employee",
        link: "/dashboard/admin/employees/create",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Employee Reports",
        link: "/dashboard/admin/employees/report",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Employee Salaries",
        link: "/dashboard/admin/employees/salaries",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Employee Attendance",
        link: "/dashboard/admin/employees/attendance",
        roles: ["ADMIN", "OFFICER"],
      },
    ],
  },
  {
    title: "Messages",
    icon: "Activity",
    roles: ["ADMIN", "OFFICER"],
    children: [
      {
        title: "All Messages",
        link: "/dashboard/admin/messages",
        roles: ["ADMIN", "OFFICER"],
      },
      {
        title: "Create Message",
        link: "/dashboard/admin/messages/create",
        roles: ["ADMIN", "OFFICER"],
      },
    ],
  },
  {
    title: "WhatsApp",
    icon: "Activity",
    roles: ["ADMIN"],
    children: [
      {
        title: "Integration",
        link: "/dashboard/admin/messages/whatsapp",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Reports",
    icon: "BarChart3",
    roles: ["ADMIN", "OFFICER", "BOOKER"],
    children: [
      {
        title: "Booking Reports",
        link: "/dashboard/admin/reports/bookings",
        roles: ["ADMIN", "OFFICER", "BOOKER"],
      },
      {
        title: "Invoice Reports",
        link: "/dashboard/admin/reports/invoices",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Activity Logs",
    icon: "Activity",
    roles: ["ADMIN"],
    children: [
      { title: "Logs", link: "/dashboard/admin/logs", roles: ["ADMIN"] },
    ],
  },
  {
    title: "Bookers",
    icon: "Users",
    roles: ["OFFICER"],
    children: [
      {
        title: "Bookers by Address",
        link: "/dashboard/admin/officer/bookers",
        roles: ["OFFICER"],
      },
    ],
  },
  {
    title: "Logout",
    icon: "LogOutIcon",
    roles: ["BOOKER", "ADMIN", "OFFICER"],
    children: [
      {
        title: "Logout",
        link: "/dashboard/admin/logout",
        roles: ["BOOKER", "ADMIN", "OFFICER"],
      },
    ],
  },
];

// 🔹 Utility
const normalizePath = (p: string) => {
  if (!p) return "/";
  const normalized = p.replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
};

type SideBarProps = { isOpen: boolean; closeSidebar: () => void };

const SideBar = ({ isOpen, closeSidebar }: SideBarProps) => {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const userRole = useSelector(
    (state: RootState) => state.loginSlice.data?.user.role
  ) as string;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const prevPathnameRef = useRef(pathname);

  // 🔹 Find Active Route and Parent
  const activeRoute = useMemo(() => {
    let found = { parent: null as string | null, link: null as string | null };
    for (const parent of navItems) {
      for (const child of parent.children || []) {
        if (!child.roles.includes(userRole)) continue;
        // ✅ EXACT MATCH
        if (normalizePath(child.link) === pathname) {
          found = { parent: parent.title, link: normalizePath(child.link) };
          break;
        }
      }
    }
    return found;
  }, [pathname, userRole]);

  // 🔹 Auto Open Active Parent
  useEffect(() => {
    if (activeRoute.parent) setOpenMenu(activeRoute.parent);
  }, [activeRoute.parent]);

  // 🔹 Close sidebar on route change (mobile)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isOpen) {
      closeSidebar();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isOpen, closeSidebar]);

  // 🔹 Escape key close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeSidebar();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeSidebar]);

  // 🔹 Resize close (desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches && isOpen)
        closeSidebar();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, closeSidebar]);

  const toggleMenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[90%] sm:w-80 bg-slate-950 text-gray-200 border-r border-gray-800 shadow-xl
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0 overflow-y-auto hide-scrollbar`}
      >
        <div className="flex justify-between lg:justify-center items-center p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white tracking-wide">
            📋 Booking App
          </h2>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md hover:bg-gray-700 lg:hidden"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item, i) => {
              const isMenuOpen = openMenu === item.title;
              const isParentActive = activeRoute.parent === item.title;
              const ParentIcon = IconMap[item.icon] || Home;

              return (
                <div key={i}>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`flex justify-between items-center w-full px-4 py-2 rounded-lg text-left transition-all duration-300 ${
                      isParentActive
                        ? "bg-gray-100 text-gray-900 font-semibold" // active route parent
                        : isMenuOpen
                        ? "bg-gray-800 text-gray-200" // just opened but not active
                        : "text-gray-300 hover:bg-gray-800 hover:text-white" // default
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <ParentIcon className="w-5 h-5 text-gray-400" />
                      {item.title}
                    </span>
                    {item.children && (
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          isMenuOpen ? "rotate-180 text-green-400" : ""
                        }`}
                      />
                    )}
                  </button>

                  {item.children && (
                    <div
                      ref={(el) => {
                        submenuRefs.current[item.title] = el;
                      }}
                      style={{
                        maxHeight: isMenuOpen
                          ? `${submenuRefs.current[item.title]?.scrollHeight}px`
                          : "0px",
                        transition: "max-height 0.35s ease-in-out",
                      }}
                      className="overflow-hidden pl-6 border-l border-gray-700"
                    >
                      <ul className="my-2 space-y-1">
                        {item.children
                          .filter((sub) => sub.roles.includes(userRole))
                          .map((sub, j) => {
                            const subLink = normalizePath(sub.link);
                            const isActive = activeRoute.link === subLink;
                            return (
                              <li key={j}>
                                <Link
                                  to={sub.link}
                                  className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                                    isActive
                                      ? "bg-gray-800 text-green-400 font-medium"
                                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                  }`}
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
