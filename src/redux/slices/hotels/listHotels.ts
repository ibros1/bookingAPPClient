import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iListedAllHotelsResponse } from "@/redux/types/hotels";
import type { iListedAddressPayload } from "@/redux/types/address";

const initialState = {
  data: {} as iListedAllHotelsResponse,
  loading: false,
  error: "",
};

export const listHotelsFn = createAsyncThunk(
  "/hotels/list",
  async (data: iListedAddressPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/hotels/list`, {
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

export const listHotelsSlice = createSlice({
  name: "List Hotels Slice",
  initialState,
  reducers: {
    createHotelRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateHotelRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteHotelRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listHotelsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedAllHotelsResponse;
      state.error = "";
    });
    builder.addCase(listHotelsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listHotelsFn.rejected, (state, action) => {
      state.data = {} as iListedAllHotelsResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createHotelRedu, updateHotelRedu, deleteHotelRdu } =
  listHotelsSlice.actions;
