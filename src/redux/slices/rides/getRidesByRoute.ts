import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iGetRidesByRoutesRespone,
  iGetRidesByRoutesPayload,
} from "@/redux/types/rides";

const initialState = {
  data: {} as iGetRidesByRoutesRespone,
  loading: false,
  error: "",
};

export const getRidesByRouteFn = createAsyncThunk(
  "/schedules/routes/get-one-by-route",
  async (payload: iGetRidesByRoutesPayload, { rejectWithValue }) => {
    try {
      const { route_id, page = 1, perPage = 10, date } = payload;

      const response = await axios.get(
        `${BASE_API_URL}/schedules/routes/get-one-by-route`,
        {
          params: {
            route_id,
            date,
            page,
            perPage,
          },
          withCredentials: true,
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

export const getRidesByRouteSlice = createSlice({
  name: "get rides by route slice",
  initialState,
  reducers: {
    resetRidesByRoute: (state) => {
      state.data = {} as iGetRidesByRoutesRespone;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRidesByRouteFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetRidesByRoutesRespone;
      state.error = "";
    });
    builder.addCase(getRidesByRouteFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getRidesByRouteFn.rejected, (state, action) => {
      state.data = {} as iGetRidesByRoutesRespone;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetRidesByRoute } = getRidesByRouteSlice.actions;

export default getRidesByRouteSlice.reducer;
