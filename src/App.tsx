import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { WhoAmiFn } from "./redux/slices/users/whoami";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(WhoAmiFn());
  }, [dispatch]);

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
