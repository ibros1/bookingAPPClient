import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type {
  iGetAllAccessDriversPayload,
  iGetAllAccessDriversResponse,
} from "../../../types/access";

const initialState = {
  data: {
    drivers: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
    isSuccess: false,
    message: "",
  } as iGetAllAccessDriversResponse,
  loading: false,
  error: "",
};

export const listDriversFn = createAsyncThunk(
  "/drivers/list",
  async (payload: iGetAllAccessDriversPayload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/roles/drivers?page=${payload.page}&limit=${payload.limit}`
      );
      return res.data as iGetAllAccessDriversResponse;
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

export const listDriversSlice = createSlice({
  name: "List Drivers Slice",
  initialState,
  reducers: {
    refreshState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listDriversFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetAllAccessDriversResponse;
      state.error = "";
    });
    builder.addCase(listDriversFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listDriversFn.rejected, (state, action) => {
      state.data = {} as iGetAllAccessDriversResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { refreshState } = listDriversSlice.actions;
export default listDriversSlice.reducer;
