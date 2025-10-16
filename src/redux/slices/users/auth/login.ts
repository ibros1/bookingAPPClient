import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { iLoginUserPayload, iLoginUserResponse } from "@/redux/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
const persistData = localStorage.getItem("user_data");
const userData = persistData ? JSON.parse(persistData) : null;

const initialState = {
  data: (userData as iLoginUserResponse) || ({} as iLoginUserResponse),
  loading: false,
  error: "",
};

export const loginFn = createAsyncThunk(
  "/auth/login",
  async (data: iLoginUserPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/users/login`, data);

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

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = {} as iLoginUserResponse;
      state.loading = false;
      state.error = "";
      localStorage.removeItem("user_data");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginFn.pending, (state) => {
      state.data = {} as iLoginUserResponse;
      state.loading = true;
      state.error = "";
    });
    builder.addCase(loginFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
      try {
        localStorage.setItem("user_data", JSON.stringify(action.payload));
      } catch {
        // ignore storage errors
      }
    });
    builder.addCase(loginFn.rejected, (state, action) => {
      state.data = {} as iLoginUserResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = loginSlice.actions;
