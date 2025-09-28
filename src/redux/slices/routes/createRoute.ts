import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iCreatedRoutePayload,
  iCreatedRouteResponse,
} from "@/redux/types/routes";
import type { RootState } from "@/redux/store";

const initialState = {
  data: {} as iCreatedRouteResponse,
  loading: false,
  error: "",
};

export const createRoutesFn = createAsyncThunk(
  "/routes/create",
  async (data: iCreatedRoutePayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.post(`${BASE_API_URL}/routes/create`, data, {
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

export const createRoutesSlice = createSlice({
  name: "Create routes Slice",
  initialState,
  reducers: {
    createRoutesState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetCreateRouteState: (state) => {
      state.data = {} as iCreatedRouteResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRoutesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedRouteResponse;
      state.error = "";
    });
    builder.addCase(createRoutesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createRoutesFn.rejected, (state, action) => {
      state.data = {} as iCreatedRouteResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRoutesState, resetCreateRouteState } =
  createRoutesSlice.actions;
