import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneAddressResponse } from "@/redux/types/address";

const initialState = {
  data: {} as iGetOneAddressResponse,
  loading: false,
  error: "",
};

export const getOneAddressFn = createAsyncThunk(
  "/Address/getOne",
  async (addressId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(
        `${BASE_API_URL}/address/:${addressId}`,
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

export const getOneAddressSlice = createSlice({
  name: "getOne Address Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneAddressFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneAddressResponse;
      state.error = "";
    });
    builder.addCase(getOneAddressFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneAddressFn.rejected, (state, action) => {
      state.data = {} as iGetOneAddressResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
