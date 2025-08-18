import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import type { iGetUserLessonProgress } from "../../types/progress";
import { BASE_API_URL } from "../../constants/base_url";
import { Default_Error_Message } from "../../constants/default_error";

const initialState = {
  data: {} as iGetUserLessonProgress,
  loading: false,
  error: "",
};

export const getLessonProgressFn = createAsyncThunk(
  "progress/get-one",
  async (
    { userId, lessonId }: { userId: number; lessonId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/lessons/progress/${userId}/${lessonId}`
      );
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

export const getLessonProgressSlice = createSlice({
  name: "GetLessonProgress",
  initialState,
  reducers: {
    resetGetLessonProgress: (state) => {
      state.data = {} as iGetUserLessonProgress;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLessonProgressFn.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getLessonProgressFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getLessonProgressFn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetGetLessonProgress } = getLessonProgressSlice.actions;
