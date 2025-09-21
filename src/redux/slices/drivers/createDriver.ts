import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { iCreatedDriverResponse } from "@/redux/types/driver";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

const initialState = {
  data: {} as iCreatedDriverResponse,
  loading: false,
  error: "",
};

export const registerDriverFn = createAsyncThunk(
  "auth/register-driver",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/drivers/create-driver`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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

export const registerDriverSlice = createSlice({
  name: "registerDriver",
  initialState,
  reducers: {
    resetRegisterDriverState: (state) => {
      state.data = {} as iCreatedDriverResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDriverFn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerDriverFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(registerDriverFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = {} as iCreatedDriverResponse;
      });
  },
});

export const { resetRegisterDriverState } = registerDriverSlice.actions;
export default registerDriverSlice;
