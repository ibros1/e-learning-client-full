import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";

import type { RootState } from "../../store";
import type { iListedPayments } from "../../../types/payment";

const initialState = {
  data: {} as iListedPayments,
  loading: false,
  error: "",
};

export const listPaymentsFn = createAsyncThunk(
  "/payments/list",
  async (__, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data.token;
      const response = await axios.get(`${BASE_API_URL}/payments/list`, {
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

export const listPaymentsSlice = createSlice({
  name: "List Payments Slice",
  initialState,
  reducers: {
    createPaymentsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updatePaymentsRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deletePaymentsRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listPaymentsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedPayments;
      state.error = "";
    });
    builder.addCase(listPaymentsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listPaymentsFn.rejected, (state, action) => {
      state.data = {} as iListedPayments;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createPaymentsRedu, updatePaymentsRedu, deletePaymentsRdu } =
  listPaymentsSlice.actions;
