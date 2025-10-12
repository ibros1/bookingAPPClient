import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";
import type {
  iListedBookingsPayload,
  iListedBookingsResponse,
} from "@/redux/types/booking";

const initialState = {
  data: {} as iListedBookingsResponse,
  loading: false,
  error: "",
};

export const listBookingsFn = createAsyncThunk(
  "/bookings/list",
  async (data: iListedBookingsPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/bookings/list`, {
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

export const listBookingsSlice = createSlice({
  name: "List Bookings Slice",
  initialState,
  reducers: {
    createBookingsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },

    updateBookingsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteBookingsRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listBookingsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedBookingsResponse;
      state.error = "";
    });
    builder.addCase(listBookingsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listBookingsFn.rejected, (state, action) => {
      state.data = {} as iListedBookingsResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createBookingsRedu, updateBookingsRedu, deleteBookingsRdu } =
  listBookingsSlice.actions;
