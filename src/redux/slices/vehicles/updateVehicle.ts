import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import type { RootState } from "../../store";
import type {
  iUpdatedVehiclePayload,
  iUpdatedVehicleResponse,
} from "@/redux/types/vehicle";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

const initialState = {
  data: {} as iUpdatedVehicleResponse,
  loading: false,
  error: "",
};

export const updateVehiclesFn = createAsyncThunk(
  "vehicles/update",
  async (data: iUpdatedVehiclePayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;

      const response = await axios.put(
        `${BASE_API_URL}/vehicles/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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

export const updateVehicleSlice = createSlice({
  name: "Update vehicle Slice",
  initialState,
  reducers: {
    resetUpdateUpdateState: (state) => {
      state.data = {} as iUpdatedVehicleResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateVehiclesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedVehicleResponse;
      state.error = "";
    });
    builder.addCase(updateVehiclesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateVehiclesFn.rejected, (state, action) => {
      state.data = {} as iUpdatedVehicleResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdateUpdateState } = updateVehicleSlice.actions;
