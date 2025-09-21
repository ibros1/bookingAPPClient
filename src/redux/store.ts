import { configureStore } from "@reduxjs/toolkit";

import { registerSlice } from "./slices/users/auth/register";
import { listVehiclesSlice } from "./slices/vehicles/listVehicles";
import { createVehicleSlice } from "./slices/vehicles/vehicle";
import { updateVehicleSlice } from "./slices/vehicles/updateVehicle";
import { listUsersSlice } from "./slices/users/listAllUsers";
import { listDriversSlice } from "./slices/users/access/drivers";
import { registerDriverSlice } from "./slices/drivers/createDriver";
import { createRoutesSlice } from "./slices/routes/createRoutes";
import { listRoutesSlice } from "./slices/routes/listAllRoutes";
import { createridesSlice } from "./slices/rides/createRide";
import { listRidesSlice } from "./slices/rides/listRides";
import { getOneBookingByRideSlice } from "./slices/bookings/getOneBookingByRide";
import { getRidesByRouteSlice } from "./slices/rides/getRidesByRoute";
import { getOneRidesSlice } from "./slices/rides/getOneRide";
import { createBookingsSlice } from "./slices/bookings/createBookings";
import { WhoAmiSlice } from "./slices/users/whoami";
import { logoutUserSlice } from "./slices/users/auth/logout";
import authSlice from "./slices/users/auth/refreshToken";
import loginSlice from "./slices/users/auth/login";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice.reducer,
    listUsersSlice: listUsersSlice.reducer,
    WhoAmiSlice: WhoAmiSlice.reducer,
    logoutUserSlice: logoutUserSlice.reducer,
    authSlice: authSlice.reducer,
    // accesss roles
    listDriversSlice: listDriversSlice.reducer,

    // vehicles
    listVehiclesSlice: listVehiclesSlice.reducer,
    createVehicleSlice: createVehicleSlice.reducer,
    updateVehicleSlice: updateVehicleSlice.reducer,

    // drivers
    registerDriverSlice: registerDriverSlice.reducer,

    // routes
    createRoutesSlice: createRoutesSlice.reducer,
    listRoutesSlice: listRoutesSlice.reducer,

    // rides
    createridesSlice: createridesSlice.reducer,
    listRidesSlice: listRidesSlice.reducer,
    getOneRidesSlice: getOneRidesSlice.reducer,
    getOneBookingByRideSlice: getOneBookingByRideSlice.reducer,
    getRidesByRouteSlice: getRidesByRouteSlice.reducer,

    // bookings
    createBookingsSlice: createBookingsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
