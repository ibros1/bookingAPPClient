import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iGetOneEmployeeResponse } from "@/redux/types/employees";

const initialState = {
  data: {} as iGetOneEmployeeResponse,
  loading: false,
  error: "",
};

export const getOneEmployeesFn = createAsyncThunk(
  "/employees/getOne",
  async (employeeId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(
        `${BASE_API_URL}/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

export const getOneEmployeesSlice = createSlice({
  name: "getOne Employees Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneEmployeesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneEmployeeResponse;
      state.error = "";
    });
    builder.addCase(getOneEmployeesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneEmployeesFn.rejected, (state, action) => {
      state.data = {} as iGetOneEmployeeResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
