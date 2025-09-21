import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { iGetOneRide } from "@/redux/types/rides";

const initialState = {
  data: {} as iGetOneRide,
  loading: false,
  error: "",
};

export const getOneRidesFn = createAsyncThunk<
  iGetOneRide, // return type
  string, // argument type (rideId MUST be a string)
  { rejectValue: string }
>("schedules/getOneRide", async (rideId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/schedules/${rideId}`, {
      withCredentials: true, // ✅ move out of headers
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
});

export const getOneRidesSlice = createSlice({
  name: "get rides Slice",
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
      state.data = {} as iGetOneRide;
      state.error = "";
    });
    builder.addCase(getOneRidesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneRidesFn.rejected, (state, action) => {
      state.data = {} as iGetOneRide;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRouteRedu, updateRouteRedu, deleteRouteRdu } =
  getOneRidesSlice.actions;
