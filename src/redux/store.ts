import { configureStore } from "@reduxjs/toolkit";
import { registerSlice } from "./slices/users/auth/register";
import { loginSlice } from "./slices/users/auth/login";
import { WhoAmiSlice } from "./slices/users/auth/me";
import { createRoutesSlice } from "./slices/routes/createRoute";
import { listRoutesSlice } from "./slices/routes/listRoutes";
import { UpdateRoutesSlice } from "./slices/routes/updateRoutes";
import { getOneRoutesSlice } from "./slices/routes/getOneRoutes";
import { DeleteRoutesSlice } from "./slices/routes/deleteRoutes";
import { createAddressSlice } from "./slices/address/createAddress";
import { listAddressSlice } from "./slices/address/listAddress";
import { UpdateAddresssSlice } from "./slices/address/updateAddress";
import { getOneAddressSlice } from "./slices/address/getOneAddress";
import { DeleteAddressSlice } from "./slices/address/deleteAddress";
import { listofficersSlice } from "./slices/officers/listOfficer";
import { createHotelsSlice } from "./slices/hotels/createHotel";
import { listHotelsSlice } from "./slices/hotels/listHotels";
import { DeleteHotelsSlice } from "./slices/hotels/deleteHotel";
import { getOneHotelsSlice } from "./slices/hotels/getOneHotel";
import { getHotelsByAddressSlice } from "./slices/hotels/getHotelsByaddress";
import { UpdateHotelsSlice } from "./slices/hotels/updateHotel";
import { listBookersSlice } from "./slices/bookers/listBookers";
import { listBookingsSlice } from "./slices/bookings/listBookings";
import { createBookingsSlice } from "./slices/bookings/createBooking";
import { createRidesSlice } from "./slices/rides/createRides";
import { listRidesSlice } from "./slices/rides/listRidesSlice";
import { getOneRidesSlice } from "./slices/rides/getOneRides";
import { UpdateRidesSlice } from "./slices/rides/updateRides";
import { DeleteRidesSlice } from "./slices/rides/deleteRides";
import { createEmployeesSlice } from "./slices/emplooyee/createEmployee";
import { listEmployeesSlice } from "./slices/emplooyee/listEmplooyee";
import { getOneEmployeesSlice } from "./slices/emplooyee/getOneEmployee";

import { getOneEmployeeByPhoneSlice } from "./slices/emplooyee/getOneByPhone";
import { UpdateEmployeesSlice } from "./slices/emplooyee/updateEmployee";
import { DeleteEmployeesSlice } from "./slices/emplooyee/deleteEmployee";
import { createMessagesSlice } from "./slices/messages/sendMessage";
import { listMessagesSlice } from "./slices/messages/listMessages";
import { getOneMessageSlice } from "./slices/messages/getOneMessage";

import { listUsersSlice } from "./slices/users/getAllUsers";
import { updateRoleSlice } from "./slices/users/updateRole";
import { listLogsSlice } from "./activity/ListActivity";
import { listMyBookingsSlice } from "./slices/bookings/myBooking";
import { getOneBookingDetailSlice } from "./slices/bookings/getDetailBooking";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice.reducer,
    WhoAmiSlice: WhoAmiSlice.reducer,
    listofficersSlice: listofficersSlice.reducer,
    listBookersSlice: listBookersSlice.reducer,
    listUsersSlice: listUsersSlice.reducer,
    updateRoleSlice: updateRoleSlice.reducer,

    // routes
    createRoutesSlice: createRoutesSlice.reducer,
    listRoutesSlice: listRoutesSlice.reducer,
    UpdateRoutesSlice: UpdateRoutesSlice.reducer,
    getOneRoutesSlice: getOneRoutesSlice.reducer,
    DeleteRoutesSlice: DeleteRoutesSlice.reducer,

    // address
    createAddressSlice: createAddressSlice.reducer,
    listAddressSlice: listAddressSlice.reducer,
    UpdateAddresssSlice: UpdateAddresssSlice.reducer,
    getOneAddressSlice: getOneAddressSlice.reducer,
    DeleteAddressSlice: DeleteAddressSlice.reducer,

    //hotels
    createHotelsSlice: createHotelsSlice.reducer,
    listHotelsSlice: listHotelsSlice.reducer,
    DeleteHotelsSlice: DeleteHotelsSlice.reducer,
    getOneHotelsSlice: getOneHotelsSlice.reducer,
    getHotelsByAddressSlice: getHotelsByAddressSlice.reducer,
    UpdateHotelsSlice: UpdateHotelsSlice.reducer,

    // rides
    createRidesSlice: createRidesSlice.reducer,
    listRidesSlice: listRidesSlice.reducer,
    getOneRidesSlice: getOneRidesSlice.reducer,
    UpdateRidesSlice: UpdateRidesSlice.reducer,
    DeleteRidesSlice: DeleteRidesSlice.reducer,

    // bookings
    listBookingsSlice: listBookingsSlice.reducer,
    createBookingsSlice: createBookingsSlice.reducer,
    listMyBookingsSlice: listMyBookingsSlice.reducer,
    getOneBookingDetailSlice: getOneBookingDetailSlice.reducer,

    //employees
    createEmployeesSlice: createEmployeesSlice.reducer,
    listEmployeesSlice: listEmployeesSlice.reducer,
    getOneEmployeesSlice: getOneEmployeesSlice.reducer,
    getOneEmployeeByNumberSlice: getOneEmployeeByPhoneSlice.reducer,
    UpdateEmployeesSlice: UpdateEmployeesSlice.reducer,
    DeleteEmployeesSlice: DeleteEmployeesSlice.reducer,

    // messages
    createMessagesSlice: createMessagesSlice.reducer,
    listMessagesSlice: listMessagesSlice.reducer,
    getOneMessageSlice: getOneMessageSlice.reducer,

    // logs
    listLogsSlice: listLogsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
