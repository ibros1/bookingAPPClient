import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import type {
  iListedVehiclesPayload,
  iListedVehiclesResponse,
} from "@/redux/types/vehicle";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

const initialState = {
  data: {
    vehicles: [],
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
    isSuccess: false,
    message: "",
  } as iListedVehiclesResponse,
  loading: false,
  error: "",
};

export const listVehiclesFn = createAsyncThunk(
  "/vehicles/list",
  async (data: iListedVehiclesPayload, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/vehicles/?page=${data.page}`
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

export const listVehiclesSlice = createSlice({
  name: "List Vehicles Slice",
  initialState,
  reducers: {
    refreshState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listVehiclesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedVehiclesResponse;
      state.error = "";
    });
    builder.addCase(listVehiclesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listVehiclesFn.rejected, (state, action) => {
      state.data = {} as iListedVehiclesResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { refreshState } = listVehiclesSlice.actions;
