import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { iListedLessonResponse } from "../../../types/lesson";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";

const initialState = {
  data: {} as iListedLessonResponse,
  loading: false,
  error: "",
};

export const listLessonsFn = createAsyncThunk(
  "/lessons/list",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/courses/lessons/list`);

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

export const listLessonSlice = createSlice({
  name: "List Lesson Slice",
  initialState,
  reducers: {
    createLessonRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateLessonRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteLessonRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listLessonsFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedLessonResponse;
      state.error = "";
    });
    builder.addCase(listLessonsFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listLessonsFn.rejected, (state, action) => {
      state.data = {} as iListedLessonResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createLessonRedu, updateLessonRedu, deleteLessonRedu } =
  listLessonSlice.actions;
