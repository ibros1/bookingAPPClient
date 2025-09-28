import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/default error";

import type { RootState } from "@/redux/store";
import type { iListOfiicersResponse } from "@/redux/types/user";

interface iListOfficersPayload {
  page: number;
  perPage: number;
}

const initialState = {
  data: {} as iListOfiicersResponse,
  loading: false,
  error: "",
};

export const listofficersFn = createAsyncThunk<
  iListOfiicersResponse, // return type
  iListOfficersPayload, // arg type
  { state: RootState } // thunkAPI
>("officers/list", async (data, { rejectWithValue, getState }) => {
  const appState = getState() as RootState;
  const token = appState.loginSlice.data?.token;

  try {
    const response = await axios.get<iListOfiicersResponse>(
      `${BASE_API_URL}/users/get_officers`,
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
});

export const listofficersSlice = createSlice({
  name: "officers",
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
    builder.addCase(listofficersFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListOfiicersResponse;
      state.error = "";
    });
    builder.addCase(listofficersFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listofficersFn.rejected, (state, action) => {
      state.data = {} as iListOfiicersResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createOfficerRedu, updateOfficerRedu, deleteOfficerRdu } =
  listofficersSlice.actions;

export default listofficersSlice.reducer;
