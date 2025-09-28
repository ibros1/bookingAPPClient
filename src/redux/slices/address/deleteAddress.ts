import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iDeleteAddressResponse } from "@/redux/types/address";

const initialState = {
  data: {} as iDeleteAddressResponse,
  loading: false,
  error: "",
};

export const DeleteAddressFn = createAsyncThunk(
  "/Address/Delete",
  async (addressId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/address/delete/${addressId}`,
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

export const DeleteAddressSlice = createSlice({
  name: "Delete Address Slice",
  initialState,
  reducers: {
    resetAddressRdu: (state) => {
      state.data = {} as iDeleteAddressResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(DeleteAddressFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeleteAddressResponse;
      state.error = "";
    });
    builder.addCase(DeleteAddressFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(DeleteAddressFn.rejected, (state, action) => {
      state.data = {} as iDeleteAddressResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetAddressRdu } = DeleteAddressSlice.actions;
