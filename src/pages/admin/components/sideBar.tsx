import { useEffect, useRef, useState } from "react";
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
  ChevronDown,
  CarFront,
  PlusSquare,
  LifeBuoy,
} from "lucide-react";

type SubNavItem = {
  title: string;
  link: string;
  icon: keyof typeof IconMap;
};

type NavItem = {
  title: string;
  icon: keyof typeof IconMap; // ✅ add icon for parent
  children: SubNavItem[];
};

type SideBarProps = {
  closeSidebar: () => void;
};

const navItems: NavItem[] = [
  {
    title: "Home",
    icon: "HomeIcon",
    children: [
      { title: "Dashboard", link: "/dashboard/admin", icon: "HomeIcon" },
    ],
  },
  {
    title: "Access Management",
    icon: "ShieldCheck",
    children: [
      {
        title: "All Users",
        link: "/dashboard/admin/access/users",
        icon: "Users",
      },
      {
        title: "Add User",
        link: "/dashboard/admin/access/users/new",
        icon: "UserPlus",
      },
      {
        title: "Roles & Permissions",
        link: "/dashboard/admin/access/roles",
        icon: "ShieldCheck",
      },
      {
        title: "Security Logs",
        link: "/dashboard/admin/access/logs",
        icon: "ClipboardList",
      },
    ],
  },

  {
    title: "Vehicle Management",
    icon: "CarFront",
    children: [
      {
        title: "All Vehicles",
        link: "/dashboard/admin/vehicles",
        icon: "Car", // distinct from others, for listing vehicles
      },
      {
        title: "Add Vehicle",
        link: "/dashboard/admin/vehicle/new",
        icon: "PlusSquare", // indicates adding a new vehicle
      },
    ],
  },

  {
    title: "Driver Management",
    icon: "LifeBuoy",
    children: [
      { title: "All Drivers", link: "/dashboard/admin/drivers", icon: "Car" },
      {
        title: "Add Driver",
        link: "/dashboard/admin/drivers/new",
        icon: "UserPlus",
      },

      {
        title: "Driver Reports",
        link: "/dashboard/admin/drivers/reports",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Ride Management",
    icon: "Bus",
    children: [
      { title: "All Rides", link: "/dashboard/admin/rides", icon: "Bus" },
      {
        title: "Pending Bookings",
        link: "/dashboard/admin/rides/pending",
        icon: "Activity",
      },
      {
        title: "Ongoing Rides",
        link: "/dashboard/admin/rides/ongoing",
        icon: "Truck",
      },
      {
        title: "Completed Rides",
        link: "/dashboard/admin/rides/completed",
        icon: "CheckCircle",
      },
      {
        title: "Cancelled Rides",
        link: "/dashboard/admin/rides/cancelled",
        icon: "Activity",
      },
      {
        title: "Routes",
        link: "/dashboard/admin/rides/routes",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Employee Management",
    icon: "Users",
    children: [
      { title: "All Staff", link: "/dashboard/admin/employees", icon: "Users" },
      {
        title: "Add Staff",
        link: "/dashboard/admin/employees/new",
        icon: "UserPlus",
      },
      {
        title: "Staff Roles",
        link: "/dashboard/admin/employees/roles",
        icon: "ShieldCheck",
      },
      {
        title: "Staff Logs",
        link: "/dashboard/admin/employees/logs",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Schedule Management",
    icon: "CalendarDays",
    children: [
      {
        title: "Scheduled Rides",
        link: "/dashboard/admin/schedule",
        icon: "CalendarDays",
      },
      {
        title: "Add Schedule",
        link: "/dashboard/admin/schedule/new",
        icon: "BookOpen",
      },
      {
        title: "Seats Management",
        link: "/dashboard/admin/schedule/seats",
        icon: "Users",
      },
    ],
  },
  {
    title: "Billing & Payments",
    icon: "DollarSign",
    children: [
      {
        title: "Transactions",
        link: "/dashboard/admin/billing/transactions",
        icon: "DollarSign",
      },
      {
        title: "Pending Payments",
        link: "/dashboard/admin/billing/pending",
        icon: "Activity",
      },
      {
        title: "Refunds",
        link: "/dashboard/admin/billing/refunds",
        icon: "CreditCard",
      },
      {
        title: "Driver Earnings",
        link: "/dashboard/admin/billing/driver-earnings",
        icon: "BarChart3",
      },
      {
        title: "Invoices",
        link: "/dashboard/admin/billing/invoices",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Financial Reports",
    icon: "BarChart3",
    children: [
      {
        title: "Revenue Reports",
        link: "/dashboard/admin/reports/revenue",
        icon: "BarChart3",
      },
      {
        title: "Ride Income",
        link: "/dashboard/admin/reports/income",
        icon: "DollarSign",
      },
      {
        title: "Driver Earnings",
        link: "/dashboard/admin/reports/driver-earnings",
        icon: "CreditCard",
      },
      {
        title: "Payment Breakdown",
        link: "/dashboard/admin/reports/payments",
        icon: "FileText",
      },
    ],
  },
];

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
};

export default function SideBar({ closeSidebar }: SideBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const activeMenu = navItems.find((item) =>
      item.children.some((sub) => sub.link === location.pathname)
    );
    if (activeMenu) setOpenMenu(activeMenu.title);
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
              <button
                onClick={() => toggleMenu(item.title)}
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
                  <span
                    className={`${isOpen ? "font-semibold" : "font-medium"} `}
                  >
                    {item.title}
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Submenu */}
              <div
                ref={(el) => (submenuRefs.current[item.title] = el)}
                style={{
                  maxHeight: isOpen
                    ? `${submenuRefs.current[item.title]?.scrollHeight}px`
                    : "0px",
                  transition: "max-height 0.35s ease-in-out",
                }}
                className="ml-4  mt-1 border-l border-gray-200 dark:border-gray-700 pl-2 overflow-hidden"
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
            </li>
          );
        })}
        <div className="py-16"></div>
      </ul>
    </div>
  );
}
