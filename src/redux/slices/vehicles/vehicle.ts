import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iCreatedVehiclePayload,
  iCreatedVehicleResponse,
} from "@/redux/types/vehicle";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Initial state
const initialState = {
  data: {} as iCreatedVehicleResponse,
  loading: false,
  error: "",
};

// Async thunk for creating a vehicle
export const createVehicleFn = createAsyncThunk<
  iCreatedVehicleResponse,
  iCreatedVehiclePayload
>("/vehicle/create", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/vehicles/create`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data.message || DEFAULT_ERROR_MESSAGE
      );
    }
    return rejectWithValue(DEFAULT_ERROR_MESSAGE);
  }
});

// Slice
export const createVehicleSlice = createSlice({
  name: "createVehicle",
  initialState,
  reducers: {
    resetCreateVehicleRedu: (state) => {
      state.data = {} as iCreatedVehicleResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVehicleFn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createVehicleFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(createVehicleFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCreateVehicleRedu } = createVehicleSlice.actions;

export default createVehicleSlice.reducer;
