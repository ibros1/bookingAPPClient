import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iUpdateRidePayload,
  iUpdateRideResponse,
} from "@/redux/types/rides";

const initialState = {
  data: {} as iUpdateRideResponse,
  loading: false,
  error: "",
};

export const updateRidesFn = createAsyncThunk(
  "/rides/update",
  async (data: iUpdateRidePayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.put(`${BASE_API_URL}/rides/update`, data, {
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

export const UpdateRidesSlice = createSlice({
  name: "update Rides Slice",
  initialState,
  reducers: {
    updateRidesState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetupdateRidestate: (state) => {
      state.data = {} as iUpdateRideResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateRidesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdateRideResponse;
      state.error = "";
    });
    builder.addCase(updateRidesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateRidesFn.rejected, (state, action) => {
      state.data = {} as iUpdateRideResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateRidesState, resetupdateRidestate } =
  UpdateRidesSlice.actions;
