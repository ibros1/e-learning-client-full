import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { iDeletedLesson } from "../../../types/lesson";

const initialState = {
  data: {} as iDeletedLesson,
  loading: false,
  error: "",
};

export const deleteLessonFn = createAsyncThunk(
  "/courses/lessons/delete",
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/courses/lessons/delete/${lessonId}`
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

export const deleteLessonSlice = createSlice({
  name: "delete Chapter Slice",
  initialState,
  reducers: {
    resetDeleteLessonState: (state) => {
      state.data = {} as iDeletedLesson;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteLessonFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeletedLesson;
      state.error = "";
    });
    builder.addCase(deleteLessonFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(deleteLessonFn.rejected, (state, action) => {
      state.data = {} as iDeletedLesson;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetDeleteLessonState } = deleteLessonSlice.actions;
