import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { iDeletedCourseResponse } from "../../../types/course";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";

const initialState = {
  data: {} as iDeletedCourseResponse,
  loading: false,
  error: "",
};

export const deleteCoursesFn = createAsyncThunk(
  "/courses/delete",
  async (courseId: number, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data.token;
      const response = await axios.delete(
        `${BASE_API_URL}/courses/delete/${courseId}`,
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

export const deleteCoursesSlice = createSlice({
  name: "delete Course Slice",
  initialState,
  reducers: {
    resetDeleteCourseState: (state) => {
      state.data = {} as iDeletedCourseResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteCoursesFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeletedCourseResponse;
      state.error = "";
    });
    builder.addCase(deleteCoursesFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(deleteCoursesFn.rejected, (state, action) => {
      state.data = {} as iDeletedCourseResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetDeleteCourseState } = deleteCoursesSlice.actions;
