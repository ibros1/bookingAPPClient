import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";
import type {
  iListedEmployeePayload,
  iListedEmployeeResponse,
} from "@/redux/types/employees";

const initialState = {
  data: {} as iListedEmployeeResponse,
  loading: false,
  error: "",
};

export const listEmployeesFn = createAsyncThunk(
  "/employees/list",
  async (data: iListedEmployeePayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.get(`${BASE_API_URL}/employees/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: data.page,
          limit: data.limit,
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

export const listEmployeesSlice = createSlice({
  name: "List Employees Slice",
  initialState,
  reducers: {
    createEmployeesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },

    updateEmployeesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteEmployeesRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listEmployeesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedEmployeeResponse;
      state.error = "";
    });
    builder.addCase(listEmployeesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listEmployeesFn.rejected, (state, action) => {
      state.data = {} as iListedEmployeeResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createEmployeesRedu, updateEmployeesRedu, deleteEmployeesRdu } =
  listEmployeesSlice.actions;
