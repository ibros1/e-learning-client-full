import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";

import type { ideletedEnrollementResponse } from "../../../types/enrollement";
import type { RootState } from "../../store";

const initialState = {
  data: {} as ideletedEnrollementResponse,
  loading: false,
  error: "",
};

export const deleteEnrollementFn = createAsyncThunk(
  "/enrollement/delete:/enrollId",
  async (emrollId: string, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const response = await axios.delete(
        `${BASE_API_URL}/enrollement/delete/${emrollId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

export const deleteEnrollementSlice = createSlice({
  name: "delete enrollement Slice",
  initialState,
  reducers: {
    resetDeleteEnrollementState: (state) => {
      state.data = {} as ideletedEnrollementResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteEnrollementFn.pending, (state) => {
      state.loading = true;
      state.data = {} as ideletedEnrollementResponse;
      state.error = "";
    });
    builder.addCase(deleteEnrollementFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(deleteEnrollementFn.rejected, (state, action) => {
      state.data = {} as ideletedEnrollementResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetDeleteEnrollementState } = deleteEnrollementSlice.actions;
