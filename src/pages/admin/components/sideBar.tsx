import {
  Activity,
  BarChart3,
  CalendarDays,
  CalendarPlus,
  Car,
  CarFront,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  HomeIcon,
  LifeBuoy,
  Map,
  MapPinned,
  PlusSquare,
  Receipt,
  Route,
  ShieldCheck,
  Truck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// ✅ Icon map
const IconMap: Record<string, any> = {
  HomeIcon,
  UserPlus,
  Users,
  ShieldCheck,
  Car,
  PlusSquare,
  FileText,
  Map,
  MapPinned,
  Route,
  BarChart3,
  Truck,
  CarFront,
  CalendarPlus,
  ClipboardList,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Receipt,
  LifeBuoy,
  Activity,
  ChevronDown,
};

// ✅ Sidebar menu structure
// ✅ Sidebar menu structure
const navItems = [
  {
    title: "Dashboard",
    icon: "HomeIcon",
    children: [{ title: "Home", link: "/dashboard/admin", icon: "HomeIcon" }],
  },
  {
    title: "Access Management",
    icon: "ShieldCheck",
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
    title: "Driver Management",
    icon: "CarFront",
    children: [
      { title: "All Drivers", link: "/dashboard/admin/drivers", icon: "Users" },
      {
        title: "Register Driver",
        link: "/dashboard/admin/drivers/create",
        icon: "UserPlus",
      },
      {
        title: "Driver Performance",
        link: "/dashboard/admin/drivers/performance",
        icon: "BarChart3",
      },
    ],
  },
  {
    title: "Ride Management",
    icon: "Route",
    children: [
      { title: "All Rides", link: "/dashboard/admin/rides", icon: "MapPinned" },
      {
        title: "Create Ride",
        link: "/dashboard/admin/rides/create",
        icon: "PlusSquare",
      },
      {
        title: "Ride Logs",
        link: "/dashboard/admin/rides/logs",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "Employee Management",
    icon: "Users",
    children: [
      {
        title: "All Employees",
        link: "/dashboard/admin/employees",
        icon: "Users",
      },
      {
        title: "Add Employee",
        link: "/dashboard/admin/employees/create",
        icon: "UserPlus",
      },
      {
        title: "Employee Roles",
        link: "/dashboard/admin/employees/roles",
        icon: "ShieldCheck",
      },
    ],
  },
  {
    title: "Schedule Management",
    icon: "CalendarDays",
    children: [
      {
        title: "All Schedules",
        link: "/dashboard/admin/schedules",
        icon: "CalendarDays",
      },
      {
        title: "Create Schedule",
        link: "/dashboard/admin/schedules/create",
        icon: "CalendarPlus",
      },
      {
        title: "Schedule Reports",
        link: "/dashboard/admin/schedules/reports",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Billing and Payments",
    icon: "CreditCard",
    children: [
      {
        title: "Transactions",
        link: "/dashboard/admin/payments",
        icon: "DollarSign",
      },
      { title: "Invoices", link: "/dashboard/admin/invoices", icon: "Receipt" },
      {
        title: "Payment Reports",
        link: "/dashboard/admin/payments/reports",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Financial Reports",
    icon: "BarChart3",
    children: [
      {
        title: "Performance",
        link: "/dashboard/admin/reports/performance",
        icon: "Activity",
      },
      {
        title: "Revenue",
        link: "/dashboard/admin/reports/revenue",
        icon: "DollarSign",
      },
      {
        title: "Expenses",
        link: "/dashboard/admin/reports/expenses",
        icon: "ClipboardCheck",
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
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity  duration-300 z-40 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 lg:top-18 left-0 h-full w-64 bg-white dark:bg-[#101828]  dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header with close button (mobile only) */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Menu
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
            {navItems.map((item, i) => {
              const isOpenMenu = openMenu === item.title;
              const ParentIcon = IconMap[item.icon] || HomeIcon;

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
