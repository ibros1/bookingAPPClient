import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iDeletedEmployeeResponse } from "@/redux/types/employees";

const initialState = {
  data: {} as iDeletedEmployeeResponse,
  loading: false,
  error: "",
};

export const DeleteEmployeesFn = createAsyncThunk(
  "/Employees/Delete",
  async (employeeId: string, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/employees/delete/${employeeId}`,
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

export const DeleteEmployeesSlice = createSlice({
  name: "Delete Employees Slice",
  initialState,
  reducers: {
    resetEmployeesRdu: (state) => {
      state.data = {} as iDeletedEmployeeResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(DeleteEmployeesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeletedEmployeeResponse;
      state.error = "";
    });
    builder.addCase(DeleteEmployeesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(DeleteEmployeesFn.rejected, (state, action) => {
      state.data = {} as iDeletedEmployeeResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetEmployeesRdu } = DeleteEmployeesSlice.actions;
