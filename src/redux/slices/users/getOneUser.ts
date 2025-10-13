import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneUserResponse } from "@/redux/types/user";


const initialState = {
  data: {} as iGetOneUserResponse,
  loading: false,
  error: "",
};

export const getOneUserFn = createAsyncThunk(
  "/user/getOne",
  async (userId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/get-one/${userId}`, {
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

export const getOneUserSlice = createSlice({
  name: "getOne User Slice",
  initialState,
  reducers: {
    createUserRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateUserRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteUserRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOneUserFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneUserResponse;
      state.error = "";
    });
    builder.addCase(getOneUserFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneUserFn.rejected, (state, action) => {
      state.data = {} as iGetOneUserResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createUserRedu, updateUserRedu, deleteUserRdu } =
  getOneUserSlice.actions;
