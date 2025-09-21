import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { iLogoutUserResponse } from "@/redux/types/user";

const initialState = {
  data: {} as iLogoutUserResponse,
  loading: false,
  error: "",
};

export const logOutUserFn = createAsyncThunk(
  "/logout/user",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/users/auth/logout`,
        {},
        {
          withCredentials: true, // ensures cookies are sent
        }
      );

      return res.data;
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

export const logoutUserSlice = createSlice({
  name: "logut",
  initialState,
  reducers: {
    resetLogoutState: (state) => {
      state.data = {} as iLogoutUserResponse;
      state.loading = false;
      state.error = "";

      // localStorage.removeItem("user_data");
      // Cookies.remove("auth_token");
      // Cookies.remove("refresh_token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logOutUserFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iLogoutUserResponse;
      state.error = "";
    });
    builder.addCase(logOutUserFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(logOutUserFn.rejected, (state, action) => {
      state.data = {} as iLogoutUserResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetLogoutState } = logoutUserSlice.actions;

export default logoutUserSlice.reducer;
