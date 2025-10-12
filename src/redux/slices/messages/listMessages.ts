import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";
import type {
  iListedAllMessagesPayload,
  iListedAllMessagesResponse,
} from "@/redux/types/messages";

const initialState = {
  data: {} as iListedAllMessagesResponse,
  loading: false,
  error: "",
};

export const listMessagesFn = createAsyncThunk(
  "/messages/list",
  async (data: iListedAllMessagesPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/messages/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: data.page,
          limit: data.limit,
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

export const listMessagesSlice = createSlice({
  name: "List Messages Slice",
  initialState,
  reducers: {
    createMessagesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },

    updateMessagesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteMessagesRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listMessagesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedAllMessagesResponse;
      state.error = "";
    });
    builder.addCase(listMessagesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listMessagesFn.rejected, (state, action) => {
      state.data = {} as iListedAllMessagesResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createMessagesRedu, updateMessagesRedu, deleteMessagesRdu } =
  listMessagesSlice.actions;
