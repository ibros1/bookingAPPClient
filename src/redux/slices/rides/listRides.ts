import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iListedRidesPayload,
  iListedRidesResponse,
} from "@/redux/types/rides";

const initialState = {
  data: {} as iListedRidesResponse,
  loading: false,
  error: "",
};

export const listRidesFn = createAsyncThunk(
  "/vehicles/list",
  async (data: iListedRidesPayload, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/schedules/?page=${data.page}`
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

export const listRidesSlice = createSlice({
  name: "List rides Slice",
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
    builder.addCase(listRidesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedRidesResponse;
      state.error = "";
    });
    builder.addCase(listRidesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listRidesFn.rejected, (state, action) => {
      state.data = {} as iListedRidesResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRouteRedu, updateRouteRedu, deleteRouteRdu } =
  listRidesSlice.actions;
