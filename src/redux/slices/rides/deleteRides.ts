import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iDeltedRideResponse } from "@/redux/types/rides";

const initialState = {
  data: {} as iDeltedRideResponse,
  loading: false,
  error: "",
};

export const DeleteRidesFn = createAsyncThunk(
  "/rides/Delete",
  async (routeId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.delete(`${BASE_API_URL}/rides/${routeId}`, {
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

export const DeleteRidesSlice = createSlice({
  name: "Delete Rides Slice",
  initialState,
  reducers: {
    resetRouteRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(DeleteRidesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeltedRideResponse;
      state.error = "";
    });
    builder.addCase(DeleteRidesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(DeleteRidesFn.rejected, (state, action) => {
      state.data = {} as iDeltedRideResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetRouteRdu } = DeleteRidesSlice.actions;
