import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type {
  iUpdatedEmplooyeePayload,
  iUpdatedEmployeeResponse,
} from "@/redux/types/employees";

const initialState = {
  data: {} as iUpdatedEmployeeResponse,
  loading: false,
  error: "",
};

export const updateEmployeesFn = createAsyncThunk(
  "/employees/update",
  async (data: iUpdatedEmplooyeePayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.put(
        `${BASE_API_URL}/employees/update`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
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

export const UpdateEmployeesSlice = createSlice({
  name: "update Employees Slice",
  initialState,
  reducers: {
    updateEmployeesState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetupdateEmployeestate: (state) => {
      state.data = {} as iUpdatedEmployeeResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateEmployeesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedEmployeeResponse;
      state.error = "";
    });
    builder.addCase(updateEmployeesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateEmployeesFn.rejected, (state, action) => {
      state.data = {} as iUpdatedEmployeeResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateEmployeesState, resetupdateEmployeestate } =
  UpdateEmployeesSlice.actions;
