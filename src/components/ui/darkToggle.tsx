"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function ChangeDark() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Avoid hydration mismatch
  }, []);

  if (!mounted) return null;

  // Icon based on current theme
  const themeIcon =
    theme === "light" ? (
      <Sun className="w-5 h-5 text-yellow-500" />
    ) : theme === "dark" ? (
      <Moon className="w-5 h-5 text-gray-200" />
    ) : (
      <Laptop className="w-5 h-5 text-gray-400" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center justify-center w-10 h-10 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-[#1b2540] transition"
        >
          {themeIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101828] shadow-lg"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1b2540] ${
            theme === "light"
              ? "font-semibold text-yellow-500"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          <Sun className="w-4 h-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1b2540] ${
            theme === "dark"
              ? "font-semibold text-gray-200"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          <Moon className="w-4 h-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#1b2540] ${
            theme === "system"
              ? "font-semibold text-gray-400"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          <Laptop className="w-4 h-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
