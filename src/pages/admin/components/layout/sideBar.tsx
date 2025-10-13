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
  Home,
  Landmark,
  ListIcon,
  Map,
  MapPin,
  PlaySquareIcon,
  PlusCircle,
  PlusSquare,
  Receipt,
  Shield,
  User,
  Users,
  List,
  UserPlus,
  FileText,
  DollarSign,
  CheckSquare,
  BarChart2,
  WorkflowIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

// Map of icon names to components
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

// Sidebar navigation items
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
      {
        title: "All Users",
        link: "/dashboard/admin/users",
        roles: ["ADMIN"],
      },
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
      {
        title: "All Rides",
        link: "/dashboard/admin/rides",
        roles: ["ADMIN"],
      },
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
      {
        title: "Logs",
        link: "/dashboard/admin/logs",
        roles: ["ADMIN"],
      },
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
];

type SideBarProps = { isOpen: boolean; closeSidebar: () => void };

const SideBar = ({ isOpen, closeSidebar }: SideBarProps) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const userRole = useSelector(
    (state: RootState) => state.loginSlice.data?.user.role
  ) as string;

  // Highlight menu based on route
  useEffect(() => {
    const active = navItems.find((item) =>
      item.children?.some((sub) => sub.link === location.pathname)
    );
    if (active) setOpenMenu(active.title);
  }, [location.pathname]);

  // Lock body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = (title: string) =>
    setOpenMenu((prev) => (prev === title ? null : title));

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible w-screen" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-full bg-slate-950 text-gray-200 border-r border-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex justify-between lg:justify-center   items-center p-5 border-b border-gray-800">
          <h2 className="text-xl  font-bold text-white tracking-wide">
            📋 Booking App
          </h2>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md hover:bg-gray-700 lg:hidden transition"
          >
            <X className="w-5 h-5 align-bottom text-gray-300" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 overflow-y-auto h-[calc(100%-68px)]">
          <ul className="space-y-2">
            {navItems
              .filter((item) => item.roles.includes(userRole))
              .map((item, i) => {
                const isOpenMenu = openMenu === item.title;
                const ParentIcon = IconMap[item.icon] || Home;

                return (
                  <li key={i}>
                    <span className="h-6"></span>
                    <button
                      onClick={() =>
                        item.children ? toggleMenu(item.title) : closeSidebar()
                      }
                      className={`flex justify-between mt-4 items-center w-full px-4 py-2  rounded-lg transition-all duration-300 ${
                        isOpenMenu
                          ? "bg-gray-100 text-gray-800 font-semibold shadow-inner"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <ParentIcon className="w-5 h-5 text-gray-400" />
                        {item.title}
                      </span>
                      {item.children && (
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isOpenMenu ? "rotate-180 text-green-400" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {item.children && (
                      <div
                        ref={(el) => {
                          submenuRefs.current[item.title] = el;
                        }}
                        style={{
                          maxHeight: isOpenMenu
                            ? `${
                                submenuRefs.current[item.title]?.scrollHeight
                              }px`
                            : "0px",
                          transition: "max-height 0.4s ease-in-out",
                        }}
                        className="mx-4 my-4 mt-1 border-l border-gray-700 pl-3 overflow-hidden"
                      >
                        <ul className="space-y-1 my-2">
                          {item.children
                            .filter((sub) => sub.roles.includes(userRole))
                            .map((sub, j) => {
                              const isActive = location.pathname === sub.link;
                              return (
                                <li key={j}>
                                  <Link
                                    to={sub.link}
                                    onClick={closeSidebar}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm transition-colors ${
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
                  </li>
                );
              })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
