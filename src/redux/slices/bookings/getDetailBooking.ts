import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneBookingDetailResponse } from "@/redux/types/book";

const initialState = {
  data: {} as iGetOneBookingDetailResponse,
  loading: false,
  error: "",
};

export const getOneBookingDetailFn = createAsyncThunk(
  "/BookingDetail",
  async (bookingId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(
        `${BASE_API_URL}/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const getOneBookingDetailSlice = createSlice({
  name: "getOne BookingDetail Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneBookingDetailFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneBookingDetailResponse;
      state.error = "";
    });
    builder.addCase(getOneBookingDetailFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneBookingDetailFn.rejected, (state, action) => {
      state.data = {} as iGetOneBookingDetailResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
