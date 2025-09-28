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
  "/auth/register",
  async (data: iCreatedUserPayload, { rejectWithValue }) => {
    console.log("Sending payload:", data); // <- check here
    try {
      const response = await axios.post(`${BASE_API_URL}/users/create`, data);
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const registerSlice = createSlice({
  name: "registerSlice",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.data = {} as iCreatedUserResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedUserResponse;
      state.error = "";
    });
    builder.addCase(registerUserFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(registerUserFn.rejected, (state, action) => {
      state.data = {} as iCreatedUserResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetRegisterState } = registerSlice.actions;
