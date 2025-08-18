import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";
import type {
  iUpdatedPaymentPayload,
  iUpdatedPaymentResponse,
} from "../../../types/payment";

const initialState = {
  data: {} as iUpdatedPaymentResponse,
  loading: false,
  error: "",
};

export const updatePaymentFn = createAsyncThunk(
  "/payments/update",
  async (data: iUpdatedPaymentPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;

      const response = await axios.put(
        `${BASE_API_URL}/payments/update`,
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

export const updatePaymentSlice = createSlice({
  name: "Update Payment Slice",
  initialState,
  reducers: {
    resetUpdatePaymentState: (state) => {
      state.data = {} as iUpdatedPaymentResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updatePaymentFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedPaymentResponse;
      state.error = "";
    });
    builder.addCase(updatePaymentFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updatePaymentFn.rejected, (state, action) => {
      state.data = {} as iUpdatedPaymentResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdatePaymentState } = updatePaymentSlice.actions;
