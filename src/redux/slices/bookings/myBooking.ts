import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";
import type {
  iListedMyBookingsPayload,
  iListedMyBookingsResponse,
} from "@/redux/types/booking";

const initialState = {
  data: {} as iListedMyBookingsResponse,
  loading: false,
  error: "",
};

export const listMyBookingsFn = createAsyncThunk(
  "/MyBookings/list",
  async (data: iListedMyBookingsPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: data.page,
          perPage: data.perPage,
        },
      });

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

export const listMyBookingsSlice = createSlice({
  name: "List MyBookings Slice",
  initialState,
  reducers: {
    createMyBookingsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },

    updateMyBookingsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteMyBookingsRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listMyBookingsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedMyBookingsResponse;
      state.error = "";
    });
    builder.addCase(listMyBookingsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listMyBookingsFn.rejected, (state, action) => {
      state.data = {} as iListedMyBookingsResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  createMyBookingsRedu,
  updateMyBookingsRedu,
  deleteMyBookingsRdu,
} = listMyBookingsSlice.actions;
