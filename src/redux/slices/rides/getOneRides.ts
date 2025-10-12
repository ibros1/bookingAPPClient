import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneRideResponse } from "@/redux/types/rides";

const initialState = {
  data: {} as iGetOneRideResponse,
  loading: false,
  error: "",
};

export const getOneRidesFn = createAsyncThunk(
  "/rides/getOne",
  async (routeId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/rides/${routeId}`, {
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

export const getOneRidesSlice = createSlice({
  name: "getOne Rides Slice",
  initialState,
  reducers: {
    createRouteRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateRouteRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteRouteRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOneRidesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneRideResponse;
      state.error = "";
    });
    builder.addCase(getOneRidesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneRidesFn.rejected, (state, action) => {
      state.data = {} as iGetOneRideResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRouteRedu, updateRouteRedu, deleteRouteRdu } =
  getOneRidesSlice.actions;
