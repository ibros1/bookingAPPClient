"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function ChangeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Avoid hydration mismatch
  }, []);

  if (!mounted) return null;

  // Determine display text and icon based on current theme
  const current =
    theme === "light"
      ? { label: "Light", icon: <Sun className="w-5 h-5 text-yellow-500" /> }
      : theme === "dark"
      ? { label: "Dark", icon: <Moon className="w-5 h-5 text-gray-200" /> }
      : { label: "System", icon: <Sun className="w-5 h-5 text-gray-400" /> };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center gap-2 px-12 rounded py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="flex items-center gap-2 transition-all">
            {current.icon}
            <span className="font-medium">{current.label}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[120px] mx-6 border-gray-400 rounded bg-white dark:bg-slate-900 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 ${
            theme === "light" ? "font-semibold text-yellow-500" : ""
          }`}
        >
          <Sun className="w-4 h-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 ${
            theme === "dark" ? "font-semibold text-gray-200" : ""
          }`}
        >
          <Moon className="w-4 h-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 ${
            theme === "system" ? "font-semibold text-gray-400" : ""
          }`}
        >
          <Sun className="w-4 h-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
