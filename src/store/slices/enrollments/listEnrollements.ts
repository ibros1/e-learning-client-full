import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";

import type { iListedEnrollements } from "../../../types/enrollement";
import type { RootState } from "../../store";

const initialState = {
  data: {} as iListedEnrollements,
  loading: false,
  error: "",
};

export const listEnrollementsFn = createAsyncThunk(
  "/enrollement/list",
  async (__, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data.token;
      const response = await axios.get(`${BASE_API_URL}/enrollement/list`, {
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

export const listEnrollementsSlice = createSlice({
  name: "List Chapters Slice",
  initialState,
  reducers: {
    createEnrollesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateEnrollesRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteEnrollesRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listEnrollementsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedEnrollements;
      state.error = "";
    });
    builder.addCase(listEnrollementsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listEnrollementsFn.rejected, (state, action) => {
      state.data = {} as iListedEnrollements;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createEnrollesRedu, updateEnrollesRedu, deleteEnrollesRdu } =
  listEnrollementsSlice.actions;
