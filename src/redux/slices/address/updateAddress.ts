import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iUpdatedAddressPayload,
  iUpdatedAddressResponse,
} from "@/redux/types/address";

const initialState = {
  data: {} as iUpdatedAddressResponse,
  loading: false,
  error: "",
};

export const updateAddresssFn = createAsyncThunk(
  "/Addresss/update",
  async (data: iUpdatedAddressPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.put(`${BASE_API_URL}/address/update`, data, {
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

export const UpdateAddresssSlice = createSlice({
  name: "update Addresss Slice",
  initialState,
  reducers: {
    updateAddresssState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetupdateAddressState: (state) => {
      state.data = {} as iUpdatedAddressResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateAddresssFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedAddressResponse;
      state.error = "";
    });
    builder.addCase(updateAddresssFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateAddresssFn.rejected, (state, action) => {
      state.data = {} as iUpdatedAddressResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateAddresssState, resetupdateAddressState } =
  UpdateAddresssSlice.actions;
