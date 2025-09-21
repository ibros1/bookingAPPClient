import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import type {
  iCreatedRoutesPayload,
  iCreatedRoutesResponse,
} from "@/redux/types/routes";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

const initialState = {
  data: {} as iCreatedRoutesResponse,
  loading: false,
  error: "",
};

export const createRoutesFn = createAsyncThunk(
  "/routes/create",
  async (data: iCreatedRoutesPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/routes`, data, {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true,
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
      state.data = {} as iCreatedRoutesResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRoutesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedRoutesResponse;
      state.error = "";
    });
    builder.addCase(createRoutesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createRoutesFn.rejected, (state, action) => {
      state.data = {} as iCreatedRoutesResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRoutesState, resetCreateRouteState } =
  createRoutesSlice.actions;
