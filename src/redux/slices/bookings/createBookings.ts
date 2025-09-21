import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iCreatedBookingPayload,
  iCreatedBookingResponse,
} from "@/redux/types/booking";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Initial state
const initialState = {
  data: {} as iCreatedBookingResponse,
  loading: false,
  error: "",
};

// Async thunk for creating a vehicle
export const createBookingsFn = createAsyncThunk(
  "/bookings/create",
  async (data: iCreatedBookingPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/bookings/create`,
        data
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
  }
);

// Slice
export const createBookingsSlice = createSlice({
  name: "createBookings",
  initialState,
  reducers: {
    resetCreateBookingsRedu: (state) => {
      state.data = {} as iCreatedBookingResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingsFn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createBookingsFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(createBookingsFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCreateBookingsRedu } = createBookingsSlice.actions;

export default createBookingsSlice.reducer;
