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
import ListBookings from "./pages/admin/pages/adminBookings/listBookings";
import ListAdminRides from "./pages/admin/pages/adminRides/listAdminRides";
import CreateRides from "./pages/admin/pages/adminRides/createRides";
import CreateBooking from "./pages/admin/pages/adminBookings/createBooking";
import ListAllEmployees from "./pages/admin/pages/adminEmployees/listAllEmployee";

import ListMessages from "./pages/admin/pages/adminMessages/listMessages";
import CreateMessage from "./pages/admin/pages/adminMessages/createMessage";
import MessageDetailedPage from "./pages/admin/pages/adminMessages/getDetailedMessage";
import CreateEmployee from "./pages/admin/pages/adminEmployees/createEmployee";
import ListAdminLogs from "./pages/admin/pages/AdminLogs/listLogs";
import Users from "./pages/admin/pages/usersManagement/users";

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
      path: "rides",
      element: <ListAdminRides />,
    },
    {
      path: "rides/create",
      element: <CreateRides />,
    },
    {
      path: "bookings",
      element: <ListBookings />,
    },
    {
      path: "bookings/create",
      element: <CreateBooking />,
    },
    {
      path: "employees",
      element: <ListAllEmployees />,
    },
    {
      path: "employees/create",
      element: <CreateEmployee />,
    },
    {
      path: "messages",
      element: <ListMessages />,
    },
    {
      path: "messages/create",
      element: <CreateMessage />,
    },
    {
      path: "messages/:messageId",
      element: <MessageDetailedPage />,
    },
    {
      path: "logs",
      element: <ListAdminLogs />,
    },

    {
      path: "users",
      element: <Users />,
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
