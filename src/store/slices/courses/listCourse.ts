import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { iListedCourses } from "../../../types/course";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";

const initialState = {
  data: {} as iListedCourses,
  loading: false,
  error: "",
};

export const listCoursesFn = createAsyncThunk(
  "/courses/list",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/courses`);

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

export const listCoursesSlice = createSlice({
  name: "List Course Slice",
  initialState,
  reducers: {
    createCourseRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateCourseRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteCourseRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listCoursesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedCourses;
      state.error = "";
    });
    builder.addCase(listCoursesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listCoursesFn.rejected, (state, action) => {
      state.data = {} as iListedCourses;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createCourseRedu, updateCourseRedu, deleteCourseRdu } =
  listCoursesSlice.actions;
