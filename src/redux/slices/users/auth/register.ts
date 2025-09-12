import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iCreatedUserPayload,
  iCreatedUserResponse,
} from "@/redux/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

const initialState = {
  data: {} as iCreatedUserResponse,
  loading: false,
  error: "",
};

export const registerUserFn = createAsyncThunk(
  "auth/register",
  async (data: iCreatedUserPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/users/create`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.data = {} as iCreatedUserResponse;
      state.loading = false;
      state.error = "";
    },
    clearError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserFn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerUserFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(registerUserFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = {} as iCreatedUserResponse;
      });
  },
});

export const { resetRegisterState, clearError } = registerSlice.actions;
export default registerSlice.reducer;
