import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";
import type {
  iListedLogsPayload,
  iListedLogsResponse,
} from "@/redux/types/logs";

const initialState = {
  data: {} as iListedLogsResponse,
  loading: false,
  error: "",
};

export const listLogsFn = createAsyncThunk(
  "/Logs/list",
  async (data: iListedLogsPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/activity-logs/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: data.page,
          perPage: data.perPage,
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

export const listLogsSlice = createSlice({
  name: "List Logs Slice",
  initialState,
  reducers: {
    createLogsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },

    updateLogsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteLogsRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listLogsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedLogsResponse;
      state.error = "";
    });
    builder.addCase(listLogsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listLogsFn.rejected, (state, action) => {
      state.data = {} as iListedLogsResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createLogsRedu, updateLogsRedu, deleteLogsRdu } =
  listLogsSlice.actions;
