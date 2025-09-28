import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iListedBookersResponse } from "@/redux/types/listBookers";
import type { iListedAddressPayload } from "@/redux/types/address";

interface iListBookersPayload {
  page: number;
  perPage: number;
}

const initialState = {
  data: {} as iListedBookersResponse,
  loading: false,
  error: "",
};

export const listBookersFn = createAsyncThunk<
  iListedBookersResponse, // return type
  iListBookersPayload, // arg type
  { state: RootState } // thunkAPI
>(
  "Bbokers/list",
  async (data: iListedAddressPayload, { rejectWithValue, getState }) => {
    const appState = getState() as RootState;
    const token = appState.loginSlice.data?.token;

    try {
      const response = await axios.get<iListedBookersResponse>(
        `${BASE_API_URL}/users/get_bookers`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: data.page, perPage: data.perPage },
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

export const listBookersSlice = createSlice({
  name: "Bookers",
  initialState,
  reducers: {
    createOfficerRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateOfficerRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteOfficerRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listBookersFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedBookersResponse;
      state.error = "";
    });
    builder.addCase(listBookersFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listBookersFn.rejected, (state, action) => {
      state.data = {} as iListedBookersResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createOfficerRedu, updateOfficerRedu, deleteOfficerRdu } =
  listBookersSlice.actions;

export default listBookersSlice.reducer;
