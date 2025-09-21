// src/redux/slices/authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "@/constants/base_url";

interface AuthState {
  accessToken: string | null;
  user: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  loading: false,
};

// 🔹 Refresh token thunk
export const refreshTokenFn = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/auth/refresh`,
        {},
        { withCredentials: true } // send refresh cookie
      );
      return res.data; // { accessToken, user? }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Refresh failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user?: any }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user || null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshTokenFn.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokenFn.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        if (action.payload.user) state.user = action.payload.user;
      })
      .addCase(refreshTokenFn.rejected, (state) => {
        state.loading = false;
        state.accessToken = null;
        state.user = null;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice;
