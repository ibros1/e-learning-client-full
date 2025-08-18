import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import type { iListedMyCompletedLessons } from "../../types/progress";
import { BASE_API_URL } from "../../constants/base_url";
import { Default_Error_Message } from "../../constants/default_error";

const initialState = {
  data: {} as iListedMyCompletedLessons,
  loading: false,
  error: "",
};

export const getCompletedLessonsFn = createAsyncThunk(
  "progress/get-completed",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/lessons/progress/completed/${userId}`
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

export const getCompletedLessonsSlice = createSlice({
  name: "GetCompletedLessons",
  initialState,
  reducers: {
    resetCompletedLessons: (state) => {
      state.data = {} as iListedMyCompletedLessons;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCompletedLessonsFn.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getCompletedLessonsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getCompletedLessonsFn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetCompletedLessons } = getCompletedLessonsSlice.actions;
