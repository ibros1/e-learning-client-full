import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import type {
  iCreatedProgressPayload,
  iCreatedProgressResponse,
} from "../../types/progress";
import { BASE_API_URL } from "../../constants/base_url";
import { Default_Error_Message } from "../../constants/default_error";

const initialState = {
  data: {} as iCreatedProgressResponse,
  loading: false,
  error: "",
};

export const createLessonProgressFn = createAsyncThunk(
  "progress/create",
  async (payload: iCreatedProgressPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/lessons/progress`, payload);
      return res.data;
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

export const createLessonProgressSlice = createSlice({
  name: "CreateLessonProgress",
  initialState,
  reducers: {
    resetCreateLessonProgress: (state) => {
      state.data = {} as iCreatedProgressResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createLessonProgressFn.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(createLessonProgressFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(createLessonProgressFn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetCreateLessonProgress } = createLessonProgressSlice.actions;
