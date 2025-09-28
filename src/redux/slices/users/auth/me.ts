import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { BASE_API_URL } from "../../../../constants/base_url";
import type { RootState } from "../../../store";
import type { iGetWhoAmiResponse } from "@/redux/types/me";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

const initialState = {
  data: {} as iGetWhoAmiResponse,
  loading: false,
  error: "",
};

export const WhoAmiFn = createAsyncThunk(
  "/users/getme",
  async (__, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.get(`${BASE_API_URL}/users/me`, {
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

export const WhoAmiSlice = createSlice({
  name: "get WhoAmi Slice",
  initialState,
  reducers: {
    updateWhoAmiRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteWhoAmiRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(WhoAmiFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetWhoAmiResponse;
      state.error = "";
    });
    builder.addCase(WhoAmiFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(WhoAmiFn.rejected, (state, action) => {
      state.data = {} as iGetWhoAmiResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { deleteWhoAmiRdu, updateWhoAmiRedu } = WhoAmiSlice.actions;
