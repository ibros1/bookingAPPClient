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
import ListAllUsers from "./pages/admin/pages/drivers/allDrivers";
import AddDriver from "./pages/admin/pages/drivers/addDriver";
import AllRoutes from "./pages/admin/pages/routes/allRoutes";
import CreateRoute from "./pages/admin/pages/routes/createRoute";
import ListRides from "./pages/admin/pages/rides/listRides";
import CreateRide from "./pages/admin/pages/rides/createRide";
import RoutesPage from "./pages/routes/routes";
import GetRidesByRoute from "./pages/rides/GetRidesByRoute";
import GetOneRide from "./pages/rides/getOneRide";
import AdminProtected from "./routes/adminProtected";
import AllUsers from "./pages/admin/users/allUsers";

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
          { path: "rides", element: <Rides /> },
          { path: "routes", element: <RoutesPage /> },
          { path: "bookings", element: <p>Bookings</p> },
          { path: "routes/:routeId/rides", element: <GetRidesByRoute /> },
          { path: "routes/schedules/:rideId", element: <GetOneRide /> },
          { path: "profile", element: <p>Profile</p> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },

  {
    path: "/dashboard/admin/",
    element: (
      <AdminProtected>
        <AdminRouter />
      </AdminProtected>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "drivers", element: <ListAllUsers /> },
      { path: "users", element: <AllUsers /> },
      { path: "vehicles", element: <VehicleManagement /> },
      { path: "vehicle/new", element: <CreateVehicle /> },
      { path: "drivers/new", element: <AddDriver /> },
      { path: "routes", element: <AllRoutes /> },
      { path: "routes/create", element: <CreateRoute /> },
      { path: "rides", element: <ListRides /> },
      { path: "rides/create", element: <CreateRide /> },
      { path: "*", element: <AdminNotFound /> },
    ],
  },
]);
