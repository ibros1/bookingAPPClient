import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iCreatedRidesPayload,
  iCreatedRidesResponse,
} from "@/redux/types/rides";

const initialState = {
  data: {} as iCreatedRidesResponse,
  loading: false,
  error: "",
};

export const createridesFn = createAsyncThunk(
  "/rides/create",
  async (data: iCreatedRidesPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/schedules/create`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
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

export const createridesSlice = createSlice({
  name: "Create rides Slice",
  initialState,
  reducers: {
    createridesState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetCreateridestate: (state) => {
      state.data = {} as iCreatedRidesResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createridesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedRidesResponse;
      state.error = "";
    });
    builder.addCase(createridesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createridesFn.rejected, (state, action) => {
      state.data = {} as iCreatedRidesResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createridesState, resetCreateridestate } =
  createridesSlice.actions;
