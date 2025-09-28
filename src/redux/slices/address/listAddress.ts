import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iListedAddressPayload,
  iListedAddressResponse,
} from "@/redux/types/address";
import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";

const initialState = {
  data: {} as iListedAddressResponse,
  loading: false,
  error: "",
};

export const listAddressFn = createAsyncThunk(
  "/Address/list",
  async (data: iListedAddressPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/address/list`, {
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

export const listAddressSlice = createSlice({
  name: "List Address Slice",
  initialState,
  reducers: {
    createAddressRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },

    updateAddressRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteAddressRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listAddressFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedAddressResponse;
      state.error = "";
    });
    builder.addCase(listAddressFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listAddressFn.rejected, (state, action) => {
      state.data = {} as iListedAddressResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createAddressRedu, updateAddressRedu, deleteAddressRdu } =
  listAddressSlice.actions;
