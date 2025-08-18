import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";
import type {
  iCreatedPaymentPayload,
  iCreatedPaymentResponse,
} from "../../../types/payment";

const initialState = {
  data: {} as iCreatedPaymentResponse,
  loading: false,
  error: "",
};

export const createPaymentFn = createAsyncThunk(
  "/payments/create",
  async (data: iCreatedPaymentPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data.token;
      const response = await axios.post(
        `${BASE_API_URL}/payments/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

export const createPaymentSlice = createSlice({
  name: "Create Payment Slice",
  initialState,
  reducers: {
    resetCreatePaymentState: (state) => {
      state.data = {} as iCreatedPaymentResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createPaymentFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedPaymentResponse;
      state.error = "";
    });
    builder.addCase(createPaymentFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createPaymentFn.rejected, (state, action) => {
      state.data = {} as iCreatedPaymentResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetCreatePaymentState } = createPaymentSlice.actions;
