import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneHotelResponse } from "@/redux/types/hotels";

const initialState = {
  data: {} as iGetOneHotelResponse,
  loading: false,
  error: "",
};

export const getOneHotelsFn = createAsyncThunk(
  "/hotels/getOne",
  async (hotelId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/hotels/:${hotelId}`, {
        headers: {
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

export const getOneHotelsSlice = createSlice({
  name: "getOne Hotels Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneHotelsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneHotelResponse;
      state.error = "";
    });
    builder.addCase(getOneHotelsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneHotelsFn.rejected, (state, action) => {
      state.data = {} as iGetOneHotelResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
