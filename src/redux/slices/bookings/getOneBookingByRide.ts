import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { iGetOneBookingByRide } from "@/redux/types/booking";

// ✅ Initial state
const initialState = {
  data: {} as iGetOneBookingByRide,
  loading: false,
  error: "",
};

// ✅ Async thunk to get all bookings by ride ID
export const getOneBookingByRideFn = createAsyncThunk<
  iGetOneBookingByRide,
  { rideId: string }
>("/bookings/by-ride", async ({ rideId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/bookings/ride/${rideId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data.message || DEFAULT_ERROR_MESSAGE
      );
    }
    return rejectWithValue(DEFAULT_ERROR_MESSAGE);
  }
});

// ✅ Slice
export const getOneBookingByRideSlice = createSlice({
  name: "getOneBookingByRide",
  initialState,
  reducers: {
    resetOneBookingByRide: (state) => {
      state.data = {} as iGetOneBookingByRide;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOneBookingByRideFn.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.data = {} as iGetOneBookingByRide;
      })
      .addCase(getOneBookingByRideFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(getOneBookingByRideFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = {} as iGetOneBookingByRide;
      });
  },
});

export const { resetOneBookingByRide } = getOneBookingByRideSlice.actions;

export default getOneBookingByRideSlice.reducer;
