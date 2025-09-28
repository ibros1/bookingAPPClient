import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iCreatedAddressPayload,
  iCreatedAddressResponse,
} from "../../types/address";
import { BASE_API_URL } from "@/constants/base_url";

const initialState = {
  data: {} as iCreatedAddressResponse,
  loading: false,
  error: "",
};

export const createAddressFn = createAsyncThunk(
  "/Address/create",
  async (data: iCreatedAddressPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.post(
        `${BASE_API_URL}/address/create`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
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

export const createAddressSlice = createSlice({
  name: "Create Address Slice",
  initialState,
  reducers: {
    createAddressState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetCreateAddresstate: (state) => {
      state.data = {} as iCreatedAddressResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAddressFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedAddressResponse;
      state.error = "";
    });
    builder.addCase(createAddressFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createAddressFn.rejected, (state, action) => {
      state.data = {} as iCreatedAddressResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createAddressState, resetCreateAddresstate } =
  createAddressSlice.actions;
