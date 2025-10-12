import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iListedALlUsersResponse,
  ilIstedUsersPayload,
} from "@/redux/types/user";

const initialState = {
  data: {} as iListedALlUsersResponse,
  loading: false,
  error: "",
};

export const listUsersFn = createAsyncThunk(
  "/Users/list",
  async (data: ilIstedUsersPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/users/all`, {
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

export const listUsersSlice = createSlice({
  name: "List Users Slice",
  initialState,
  reducers: {
    createUsersRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateUsersRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteUsersRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listUsersFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedALlUsersResponse;
      state.error = "";
    });
    builder.addCase(listUsersFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listUsersFn.rejected, (state, action) => {
      state.data = {} as iListedALlUsersResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createUsersRedu, updateUsersRedu, deleteUsersRdu } =
  listUsersSlice.actions;
