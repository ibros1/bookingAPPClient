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
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
