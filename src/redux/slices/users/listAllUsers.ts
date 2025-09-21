import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { iListAllUsers } from "@/redux/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

interface IListUsersState {
  data: iListAllUsers;
  loading: boolean;
  error: string;
}

const initialState: IListUsersState = {
  data: {} as iListAllUsers,
  loading: false,
  error: "",
};

// Accept page and size as payload
export const listUsersFn = createAsyncThunk(
  "/users/list",
  async (
    { page = 1, size = 10 }: { page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/users/all?page=${page}&size=${size}`
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

export const listUsersSlice = createSlice({
  name: "List users Slice",
  initialState,
  reducers: {
    createUserRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateUserRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteUserRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listUsersFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListAllUsers;
      state.error = "";
    });
    builder.addCase(listUsersFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listUsersFn.rejected, (state, action) => {
      state.data = {} as iListAllUsers;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createUserRedu, updateUserRedu, deleteUserRdu } =
  listUsersSlice.actions;

export default listUsersSlice.reducer;
