import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iGetHotelsByAddressPayload,
  iGetHotelsByAddressResponse,
} from "@/redux/types/hotels";

const initialState = {
  data: {} as iGetHotelsByAddressResponse,
  loading: false,
  error: "",
};

export const getHotelsByAddressFn = createAsyncThunk(
  "/hotels/getbyaddress",
  async (data: iGetHotelsByAddressPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(
        `${BASE_API_URL}/hotels/get_by_address`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: data.page,
            perPage: data.perPage,
            addressId: data.addressId,
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

export const getHotelsByAddressSlice = createSlice({
  name: "getHotelByAddresss Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHotelsByAddressFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetHotelsByAddressResponse;
      state.error = "";
    });
    builder.addCase(getHotelsByAddressFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getHotelsByAddressFn.rejected, (state, action) => {
      state.data = {} as iGetHotelsByAddressResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
