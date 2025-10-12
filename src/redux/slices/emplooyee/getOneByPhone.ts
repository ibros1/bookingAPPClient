import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iGetOneEmployeeByPhonePayload,
  iGetOneEmployeeByPhoneResponse,
} from "@/redux/types/employees";

const initialState = {
  data: {} as iGetOneEmployeeByPhoneResponse,
  loading: false,
  error: "",
};

export const getOneEmployeeByPhone = createAsyncThunk(
  "/employees/get_by_phone",
  async (
    data: iGetOneEmployeeByPhonePayload,
    { rejectWithValue, getState }
  ) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(
        `${BASE_API_URL}/employees/get_by_phone`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            phone: data.phone,
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

export const getOneEmployeeByPhoneSlice = createSlice({
  name: "get One Employee by Phone Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneEmployeeByPhone.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneEmployeeByPhoneResponse;
      state.error = "";
    });
    builder.addCase(getOneEmployeeByPhone.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneEmployeeByPhone.rejected, (state, action) => {
      state.data = {} as iGetOneEmployeeByPhoneResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
