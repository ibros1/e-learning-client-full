import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";

import type { iGetOneCourseResponse } from "../../../types/course";

const initialState = {
  data: {} as iGetOneCourseResponse,
  loading: false,
  error: "",
};

export const getOneCourseFn = createAsyncThunk(
  "/courses/:courseId",
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/courses/${courseId}`);

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
  name: "Get One Course Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneCourseFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneCourseResponse;
      state.error = "";
    });
    builder.addCase(getOneCourseFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneCourseFn.rejected, (state, action) => {
      state.data = {} as iGetOneCourseResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
