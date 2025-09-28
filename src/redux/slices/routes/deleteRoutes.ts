import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iDeleteRouteResponse } from "@/redux/types/routes";

const initialState = {
  data: {} as iDeleteRouteResponse,
  loading: false,
  error: "",
};

export const DeleteRoutesFn = createAsyncThunk(
  "/routes/Delete",
  async (routeId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/routes/:${routeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

export const DeleteRoutesSlice = createSlice({
  name: "Delete Routes Slice",
  initialState,
  reducers: {
    resetRouteRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(DeleteRoutesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeleteRouteResponse;
      state.error = "";
    });
    builder.addCase(DeleteRoutesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(DeleteRoutesFn.rejected, (state, action) => {
      state.data = {} as iDeleteRouteResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetRouteRdu } = DeleteRoutesSlice.actions;
