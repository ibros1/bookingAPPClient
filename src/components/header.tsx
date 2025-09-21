import type { RootState } from "@/redux/store";
import { Book, Bus, Home, Info, MapPin, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import AuthSection from "./profile/myProfile";
import Search from "./search";
import { ChangeToggle } from "./ui/theme";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const userState = useSelector((state: RootState) => state.WhoAmiSlice);
  // const user = userState?.data;
  // const navigate = useNavigate();
  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/routes", label: "Routes", icon: Bus },
    { to: "/stations", label: "Stations", icon: MapPin },
    { to: "/tickets", label: "Tickets", icon: Book },
    { to: "/about", label: "About", icon: Info },
  ];

  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Close mobile nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900 dark:text-white backdrop-blur-md  border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="mx-auto  px-6 py-2 flex items-center justify-between">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 group hover:text-blue-600 transition"
          >
            <span className=" hidden lg:flex text-2xl font-bold text-gray-900 dark:text-white">
              🚍TransportApp
            </span>
            <span className="flex lg:hidden text-3xl  font-bold text-gray-900 dark:text-white">
              🚍
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1 px-3 py-2 rounded-md transition group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + Auth */}
        <div className="flex items-center gap-4">
          <Search />
          <ChangeToggle />

          <AuthSection />
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        ref={mobileNavRef}
        className={`lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-t border-gray-200 dark:border-gray-700 transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 grid grid-cols-3 gap-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition"
              >
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
                <span className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
