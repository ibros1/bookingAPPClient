import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneMessageResponse } from "@/redux/types/getOneMesasage";

const initialState = {
  data: {} as iGetOneMessageResponse,
  loading: false,
  error: "",
};

export const getOneMessageFn = createAsyncThunk(
  "/Message/getOne",
  async (messageId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(
        `${BASE_API_URL}/messages/get_by_id/${messageId}`,
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

export const getOneMessageSlice = createSlice({
  name: "getOne Message Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneMessageFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneMessageResponse;
      state.error = "";
    });
    builder.addCase(getOneMessageFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneMessageFn.rejected, (state, action) => {
      state.data = {} as iGetOneMessageResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
