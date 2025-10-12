import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { RootState } from "@/redux/store";
import type {
  iUpdatedRolePayload,
  iUpdatedRoleRespone,
} from "@/redux/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

const initialState = {
  data: {} as iUpdatedRoleRespone,
  loading: false,
  error: "",
};

export const updateRoleFn = createAsyncThunk(
  "/users/role/update",
  async (data: iUpdatedRolePayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const res = await axios.put(`${BASE_API_URL}/users/update-role`, data, {
        headers: {
          Authorization: `BEARER ${token}`,
        },
      });

      return res.data;
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

export const updateRoleSlice = createSlice({
  name: "Update Role Slice",
  reducers: {
    resetUpdatedRoleState: (state) => {
      state.data = {} as iUpdatedRoleRespone;
      state.loading = false;
      state.error = "";
    },
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(updateRoleFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedRoleRespone;
      state.error = "";
    });
    builder.addCase(updateRoleFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateRoleFn.rejected, (state, action) => {
      state.loading = false;
      state.data = {} as iUpdatedRoleRespone;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdatedRoleState } = updateRoleSlice.actions;
