// src/redux/slices/userManagement/userManagementSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";
import type { RootState } from "@/redux/store";

export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string;
  isActive?: boolean;
  // add other fields you need
}

export interface UserListPayload {
  page?: number;
  perPage?: number;
  role?: string;
  search?: string;
}

export interface CreateUserPayload {
  name: string;
  email?: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address?: string;
  role?: string;
  permissions?: string[];
}

export interface UpdateUserPayload {
  userId: string;
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  role?: string;
  permissions?: string[];
}

export interface DeleteUserPayload {
  userId: string;
}

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
  createUserLoading: boolean;
  updateUserLoading: boolean;
  deleteUserLoading: boolean;
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const initialState: UserManagementState = {
  users: [],
  loading: false,
  error: null,
  createUserLoading: false,
  updateUserLoading: false,
  deleteUserLoading: false,
  total: 0,
  page: 1,
  perPage: 10,
  totalPages: 0,
};

// Thunks
export const getAllUsers = createAsyncThunk(
  "userManagement/getAllUsers",
  async (payload: UserListPayload = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.loginSlice?.data?.token;
      const res = await axios.get(`${BASE_API_URL}/users/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: {
          page: payload.page ?? 1,
          perPage: payload.perPage ?? 10,
          role: payload.role,
          search: payload.search,
        },
      });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(
          err.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const createUser = createAsyncThunk(
  "userManagement/createUser",
  async (payload: CreateUserPayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.loginSlice?.data?.token;
      const res = await axios.post(`${BASE_API_URL}/users/create`, payload, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(
          err.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const updateUser = createAsyncThunk(
  "userManagement/updateUser",
  async (payload: UpdateUserPayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.loginSlice?.data?.token;
      const res = await axios.put(`${BASE_API_URL}/users/update`, payload, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(
          err.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "userManagement/deleteUser",
  async (payload: DeleteUserPayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.loginSlice?.data?.token;
      const res = await axios.delete(
        `${BASE_API_URL}/users/delete/${payload.userId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(
          err.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// Slice
export const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
    clearUsers(state) {
      state.users = [];
      state.total = 0;
      state.page = 1;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    // getAllUsers
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload?.users || [];
      state.total = action.payload?.total || state.users.length;
      state.page = action.payload?.page || 1;
      state.perPage = action.payload?.perPage || state.perPage;
      state.totalPages =
        action.payload?.totalPages || Math.ceil(state.total / state.perPage);
      state.error = null;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createUser
    builder.addCase(createUser.pending, (state) => {
      state.createUserLoading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.createUserLoading = false;
      if (action.payload?.user) {
        state.users.unshift(action.payload.user);
        state.total += 1;
      }
      state.error = null;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.createUserLoading = false;
      state.error = action.payload as string;
    });

    // updateUser
    builder.addCase(updateUser.pending, (state) => {
      state.updateUserLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.updateUserLoading = false;
      if (action.payload?.user) {
        const idx = state.users.findIndex(
          (u) => u.id === action.payload.user.id
        );
        if (idx !== -1) state.users[idx] = action.payload.user;
      }
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.updateUserLoading = false;
      state.error = action.payload as string;
    });

    // deleteUser
    builder.addCase(deleteUser.pending, (state) => {
      state.deleteUserLoading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.deleteUserLoading = false;
      const removedId = action.meta.arg.userId;
      state.users = state.users.filter((u) => u.id !== removedId);
      state.total = Math.max(0, state.total - 1);
      state.error = null;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.deleteUserLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearErrors, clearUsers } = userManagementSlice.actions;
export default userManagementSlice.reducer;
