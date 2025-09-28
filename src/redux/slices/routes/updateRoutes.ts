import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iUpdatedRoutePayload,
  iUpdatedRouteResponse,
} from "@/redux/types/routes";

const initialState = {
  data: {} as iUpdatedRouteResponse,
  loading: false,
  error: "",
};

export const updateRoutesFn = createAsyncThunk(
  "/routes/update",
  async (data: iUpdatedRoutePayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.put(`${BASE_API_URL}/routes/update`, data, {
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

export const UpdateRoutesSlice = createSlice({
  name: "update routes Slice",
  initialState,
  reducers: {
    updateRoutesState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetupdateRouteState: (state) => {
      state.data = {} as iUpdatedRouteResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateRoutesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedRouteResponse;
      state.error = "";
    });
    builder.addCase(updateRoutesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateRoutesFn.rejected, (state, action) => {
      state.data = {} as iUpdatedRouteResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateRoutesState, resetupdateRouteState } =
  UpdateRoutesSlice.actions;
