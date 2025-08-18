import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";

import type { iGetOneEnrollementResponse } from "../../../types/enrollement";

const initialState = {
  data: {} as iGetOneEnrollementResponse,
  loading: false,
  error: "",
};

export const getOneEnrollementFn = createAsyncThunk(
  "/enrollement/:enrollementId",
  async (enrollId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/enrollement/${enrollId}`
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

export const getOneCourseSlice = createSlice({
  name: "Get One enrollement Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneEnrollementFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneEnrollementResponse;
      state.error = "";
    });
    builder.addCase(getOneEnrollementFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneEnrollementFn.rejected, (state, action) => {
      state.data = {} as iGetOneEnrollementResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
