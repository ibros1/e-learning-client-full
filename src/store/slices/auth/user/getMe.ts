import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { BASE_API_URL } from "../../../../constants/base_url";
import type { RootState } from "../../../store";
import { Default_Error_Message } from "../../../../constants/default_error";
import type { iGetWhoAMi } from "../../../../types/getMe";

const initialState = {
  data: {} as iGetWhoAMi,
  loading: false,
  error: "",
};

export const WhoAmiFn = createAsyncThunk(
  "/users/getme",
  async (__, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.get(`${BASE_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || Default_Error_Message
        );
      }
      return rejectWithValue(Default_Error_Message);
    }
  }
);

export const WhoAmiSlice = createSlice({
  name: "List WhoAmi Slice",
  initialState,
  reducers: {
    updateWhoAmiRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteWhoAmiRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(WhoAmiFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetWhoAMi;
      state.error = "";
    });
    builder.addCase(WhoAmiFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(WhoAmiFn.rejected, (state, action) => {
      state.data = {} as iGetWhoAMi;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { deleteWhoAmiRdu, updateWhoAmiRedu } = WhoAmiSlice.actions;
