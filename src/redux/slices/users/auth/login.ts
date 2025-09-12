import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  ILoginUserGoogleResponse,
  iLoginUserPayload,
  iLoginUserResponse,
} from "@/redux/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const persistedUser = localStorage.getItem("user_data");
const initialState = {
  data: persistedUser ? JSON.parse(persistedUser) : ({} as iLoginUserResponse),
  loading: false,
  error: "",
  loggedIn: !!persistedUser,
};
export interface GoogleLoginResponse {
  isSuccess: boolean;
  message: string;
  user: ILoginUserGoogleResponse;
  token: string;
  refreshToken: string;
}
// ---------------- EMAIL/PASSWORD LOGIN ----------------
export const loginFn = createAsyncThunk(
  "auth/login",
  async (data: iLoginUserPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/users/login`, data);

      const { token, user, refreshToken } = res.data;

      console.log(res.data);
      // Store token in cookies
      Cookies.set("auth_token", token, { secure: true, sameSite: "lax" });
      Cookies.set("refresh_token", refreshToken, {
        secure: true,
        sameSite: "strict",
      });

      localStorage.setItem(
        "user_data",
        JSON.stringify({ isSuccess: true, message: res.data.message, user })
      );

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(
          err.response?.data.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const handleGoogleCallback = createAsyncThunk<
  GoogleLoginResponse,
  { token: string; user: ILoginUserGoogleResponse; refreshToken: string },
  { rejectValue: string }
>(
  "auth/google/callback",
  async ({ token, user, refreshToken }, { rejectWithValue }) => {
    try {
      const payload: GoogleLoginResponse = {
        isSuccess: true,
        message: "Successfully logged in with Google",
        user, // ✅ user is already an object
        token,
        refreshToken,
      };

      localStorage.setItem("user_data", JSON.stringify(payload));

      Cookies.set("auth_token", token, { secure: true, sameSite: "lax" });
      Cookies.set("refresh_token", refreshToken, {
        secure: true,
        sameSite: "strict",
      });

      return payload;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Failed to process Google login");
    }
  }
);

// ---------------- SLICE ----------------
export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.data = {} as iLoginUserResponse;
      state.loading = false;
      state.error = "";
      state.loggedIn = false;
      localStorage.removeItem("user_data");
      Cookies.remove("auth_token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Email/password login
      .addCase(loginFn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.loggedIn = true;
      })
      .addCase(loginFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.loggedIn = false;
      })

      // Google login
      .addCase(handleGoogleCallback.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(handleGoogleCallback.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.loggedIn = true;
      })
      .addCase(handleGoogleCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "";
        state.loggedIn = false;
      });
  },
});

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;
