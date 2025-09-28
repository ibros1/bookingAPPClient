import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iUpdatedHotelPayload,
  iUpdatedHotelResponse,
} from "@/redux/types/hotels";

const initialState = {
  data: {} as iUpdatedHotelResponse,
  loading: false,
  error: "",
};

export const updateHotelsFn = createAsyncThunk(
  "/hotels/update",
  async (data: iUpdatedHotelPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.put(`${BASE_API_URL}/hotels/update`, data, {
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

export const UpdateHotelsSlice = createSlice({
  name: "update Hotels Slice",
  initialState,
  reducers: {
    updateHotelsState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetupdateHotelstate: (state) => {
      state.data = {} as iUpdatedHotelResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateHotelsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedHotelResponse;
      state.error = "";
    });
    builder.addCase(updateHotelsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateHotelsFn.rejected, (state, action) => {
      state.data = {} as iUpdatedHotelResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateHotelsState, resetupdateHotelstate } =
  UpdateHotelsSlice.actions;
