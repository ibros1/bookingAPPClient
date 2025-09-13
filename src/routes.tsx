// router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminNotFound from "./components/Admin404";
import NotFoundPage from "./components/NotFoundPage";
import AdminDashboard from "./pages/admin/pages/adminDashboard";
import AdminRouter from "./pages/admin/pages/adminRouter";

import VehicleManagement from "./pages/admin/pages/vehicles/listVehicle";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import HomePage from "./pages/home/homePage";
import MainRoute from "./pages/mainRoute";
import Rides from "./pages/rides";
import AuthRoute from "./routes/AuthRoute";
import ProtectedRoute from "./routes/protectedRoute";
import CreateVehicle from "./pages/admin/pages/vehicles/createVehicle";

export const router = createBrowserRouter([
  {
    element: <AuthRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/login/*", element: <Navigate to="/login" replace /> },
      { path: "/register/*", element: <Navigate to="/login" replace /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "rides", element: <Rides /> }, // Correct: no leading slash
          { path: "bookings", element: <p>Bookings</p> }, // Correct: no leading slash
          { path: "profile", element: <p>Profile</p> },
          { path: "*", element: <NotFoundPage /> },
          // Correct: no leading slash
        ],
      },
    ],
  },

  {
    path: "/dashboard/admin/",
    element: <AdminRouter />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "vehicles",
        element: <VehicleManagement />,
      },
      {
        path: "vehicle/new",
        element: <CreateVehicle />,
      },
      { path: "*", element: <AdminNotFound /> },
    ],
  },
]);
