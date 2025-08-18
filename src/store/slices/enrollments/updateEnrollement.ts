import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";

import type {
  iUpdatedEnrollment,
  iUpdatedEnrollmentPayload,
} from "../../../types/enrollement";

const initialState = {
  data: {} as iUpdatedEnrollment,
  loading: false,
  error: "",
};

export const updateEnrollementFn = createAsyncThunk(
  "/enrollement/update",
  async (data: iUpdatedEnrollmentPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;

      const response = await axios.put(
        `${BASE_API_URL}/enrollement/update`,
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

export const updateEnrollementSlice = createSlice({
  name: "Update Enrollement Slice",
  initialState,
  reducers: {
    resetUpdateEnrollementState: (state) => {
      state.data = {} as iUpdatedEnrollment;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateEnrollementFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedEnrollment;
      state.error = "";
    });
    builder.addCase(updateEnrollementFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateEnrollementFn.rejected, (state, action) => {
      state.data = {} as iUpdatedEnrollment;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdateEnrollementState } = updateEnrollementSlice.actions;
