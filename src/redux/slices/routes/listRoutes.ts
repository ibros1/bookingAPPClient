import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iListedRoutesPaylod,
  iListedRoutesResponse,
} from "@/redux/types/routes";
import type { RootState } from "@/redux/store";

const initialState = {
  data: {} as iListedRoutesResponse,
  loading: false,
  error: "",
};

export const listRoutesFn = createAsyncThunk(
  "/routes/list",
  async (data: iListedRoutesPaylod, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/routes/list`, {
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

export const listRoutesSlice = createSlice({
  name: "List Routes Slice",
  initialState,
  reducers: {
    createRouteRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateRouteRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteRouteRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listRoutesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedRoutesResponse;
      state.error = "";
    });
    builder.addCase(listRoutesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listRoutesFn.rejected, (state, action) => {
      state.data = {} as iListedRoutesResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createRouteRedu, updateRouteRedu, deleteRouteRdu } =
  listRoutesSlice.actions;
