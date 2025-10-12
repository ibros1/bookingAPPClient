import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneRouteResponse } from "@/redux/types/routes";

const initialState = {
  data: {} as iGetOneRouteResponse,
  loading: false,
  error: "",
};

export const getOneRoutesFn = createAsyncThunk(
  "/routes/getOne",
  async (routeId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/routes/${routeId}`, {
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

export const getOneRoutesSlice = createSlice({
  name: "getOne Routes Slice",
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
    builder.addCase(getOneRoutesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneRouteResponse;
      state.error = "";
    });
    builder.addCase(getOneRoutesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneRoutesFn.rejected, (state, action) => {
      state.data = {} as iGetOneRouteResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRouteRedu, updateRouteRedu, deleteRouteRdu } =
  getOneRoutesSlice.actions;
