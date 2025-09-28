import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iCreatedHotelPayload,
  iCreatedHotelResponse,
} from "@/redux/types/hotels";

const initialState = {
  data: {} as iCreatedHotelResponse,
  loading: false,
  error: "",
};

export const createHotelsFn = createAsyncThunk(
  "/hotels/create",
  async (data: iCreatedHotelPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.post(`${BASE_API_URL}/hotels/create`, data, {
        headers: {
          "Content-Type": "application/json",
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

export const createHotelsSlice = createSlice({
  name: "Create Hotels Slice",
  initialState,
  reducers: {
    createHotelsState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetCreateHotelstate: (state) => {
      state.data = {} as iCreatedHotelResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createHotelsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedHotelResponse;
      state.error = "";
    });
    builder.addCase(createHotelsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createHotelsFn.rejected, (state, action) => {
      state.data = {} as iCreatedHotelResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createHotelsState, resetCreateHotelstate } =
  createHotelsSlice.actions;
