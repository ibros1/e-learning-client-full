import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";

import type {
  iCreatedEnrollmentPayload,
  iCreatedEnrollmentResponse,
} from "../../../types/enrollement";

const initialState = {
  data: {} as iCreatedEnrollmentResponse,
  loading: false,
  error: "",
};

export const createEnrollmentFn = createAsyncThunk(
  "/enrollement/create",
  async (data: iCreatedEnrollmentPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data.token;
      const response = await axios.post(
        `${BASE_API_URL}/enrollement/create`,
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

export const createEnrollementSlice = createSlice({
  name: "Create Enrollement Slice",
  initialState,
  reducers: {
    createEnrolleState: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    resetCreateEnrollState: (state) => {
      state.data = {} as iCreatedEnrollmentResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createEnrollmentFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedEnrollmentResponse;
      state.error = "";
    });
    builder.addCase(createEnrollmentFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createEnrollmentFn.rejected, (state, action) => {
      state.data = {} as iCreatedEnrollmentResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createEnrolleState, resetCreateEnrollState } =
  createEnrollementSlice.actions;
