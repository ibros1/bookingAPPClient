import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminNotFound from "./components/Admin404";

import AdminRouter from "./pages/admin/routes/adminRouter";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AllRoutes from "./pages/admin/pages/adminRoutes/listAdminRoute";
import CreateRoute from "./pages/admin/pages/adminRoutes/createRoutes";
import AllAddresses from "./pages/admin/pages/adminAddress.tsx/listAdminAddress";
import ProtectedAdminRoute from "./pages/admin/routes/protectedAdmin";
import CreateAddress from "./pages/admin/pages/adminAddress.tsx/createAddresa";
import AdminDashboard from "./pages/admin/pages/adminstrationComponent/adminDashboard";
import ListHotels from "./pages/admin/pages/adminhotels.tsx/listHotel";
import CreateHotel from "./pages/admin/pages/adminhotels.tsx/createHotel";

const authRoutes = {
  path: "/auth",
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "*", element: <Navigate to="/auth/login" replace /> },
  ],
};

const adminRoutes = {
  path: "/dashboard/admin",
  element: (
    <ProtectedAdminRoute>
      <AdminRouter />
    </ProtectedAdminRoute>
  ), // always render layout
  children: [
    {
      index: true,

      element: <AdminDashboard />,
    },
    {
      path: "routes",
      element: <AllRoutes />,
    },
    {
      path: "routes/create",
      element: <CreateRoute />,
    },
    {
      path: "addresses",
      element: <AllAddresses />,
    },
    {
      path: "addresses/create",
      element: <CreateAddress />,
    },
    {
      path: "hotels",
      element: <ListHotels />,
    },
    {
      path: "hotels/create",
      element: <CreateHotel />,
    },
    {
      path: "*",
      element: <AdminNotFound />,
    },
  ],
};

export const router = createBrowserRouter([
  authRoutes,
  adminRoutes,

  { path: "*", element: <Navigate to="/auth/login" replace /> },
]);
