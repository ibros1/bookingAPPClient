import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";
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
  "/rides/list",
  async (data: iListedRidesPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/rides/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: data.page,
          perPage: data.perPage,
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

export const listRidesSlice = createSlice({
  name: "List Rides Slice",
  initialState,
  reducers: {
    createRidesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },

    updateRidesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteRidesRdu: (state, action) => {
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

export const { createRidesRedu, updateRidesRedu, deleteRidesRdu } =
  listRidesSlice.actions;
