import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // handle dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("dark", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("dark", "false");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved === "true") setIsDarkMode(true);
  }, []);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
