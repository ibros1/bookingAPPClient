import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/users/auth/login";
import { registerSlice } from "./slices/users/auth/register";
import { listVehiclesSlice } from "./slices/vehicles/listVehicles";
import { createVehicleSlice } from "./slices/vehicles/vehicle";
import { updateVehicleSlice } from "./slices/vehicles/updateVehicle";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice.reducer,

    // vehicles
    listVehiclesSlice: listVehiclesSlice.reducer,
    createVehicleSlice: createVehicleSlice.reducer,
    updateVehicleSlice: updateVehicleSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
