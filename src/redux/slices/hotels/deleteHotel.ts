import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iDeletedHotelResponse } from "@/redux/types/hotels";

const initialState = {
  data: {} as iDeletedHotelResponse,
  loading: false,
  error: "",
};

export const DeleteHotelsFn = createAsyncThunk(
  "/Hotels/Delete",
  async (hotelId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.delete(`${BASE_API_URL}/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

export const DeleteHotelsSlice = createSlice({
  name: "Delete Hotels Slice",
  initialState,
  reducers: {
    resetRouteRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(DeleteHotelsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeletedHotelResponse;
      state.error = "";
    });
    builder.addCase(DeleteHotelsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(DeleteHotelsFn.rejected, (state, action) => {
      state.data = {} as iDeletedHotelResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetRouteRdu } = DeleteHotelsSlice.actions;
