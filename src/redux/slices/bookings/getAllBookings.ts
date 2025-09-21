import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { iListedAllBookingsResponse } from "@/redux/types/booking";

// ✅ Initial state
const initialState = {
  data: {} as iListedAllBookingsResponse,
  loading: false,
  error: "",
};

// ✅ Async thunk to get all bookings with pagination
export const listBookingsFn = createAsyncThunk<
  iListedAllBookingsResponse,
  { page?: number; limit?: number }
>("/bookings/list", async (params, { rejectWithValue }) => {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await axios.get(
      `${BASE_API_URL}/bookings?page=${page}&limit=${limit}`,
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
export const listBookingsSlice = createSlice({
  name: "listBookings",
  initialState,
  reducers: {
    resetListBookingsRedu: (state) => {
      state.data = {} as iListedAllBookingsResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listBookingsFn.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.data = {} as iListedAllBookingsResponse;
      })
      .addCase(listBookingsFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(listBookingsFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = {} as iListedAllBookingsResponse;
      });
  },
});

export const { resetListBookingsRedu } = listBookingsSlice.actions;

export default listBookingsSlice.reducer;
