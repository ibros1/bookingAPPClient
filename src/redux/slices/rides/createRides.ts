import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";

import { BASE_API_URL } from "@/constants/base_url";
import type {
  iCreatedRidesPayload,
  iCreatedRidesResponse,
} from "@/redux/types/rides";

const initialState = {
  data: {} as iCreatedRidesResponse,
  loading: false,
  error: "",
};

export const createRidesFn = createAsyncThunk(
  "/rides/create",
  async (data: iCreatedRidesPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.post(`${BASE_API_URL}/rides/create`, data, {
        headers: {
          "Content-Type": "application/json",
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

export const createRidesSlice = createSlice({
  name: "Create Rides Slice",
  initialState,
  reducers: {
    createRidesState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetCreateRidestate: (state) => {
      state.data = {} as iCreatedRidesResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRidesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedRidesResponse;
      state.error = "";
    });
    builder.addCase(createRidesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createRidesFn.rejected, (state, action) => {
      state.data = {} as iCreatedRidesResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRidesState, resetCreateRidestate } =
  createRidesSlice.actions;
