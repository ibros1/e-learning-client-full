import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { iCreatedCourseResponse } from "../../../types/course";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";

const initialState = {
  data: {} as iCreatedCourseResponse,
  loading: false,
  error: "",
};

export const createCourseFn = createAsyncThunk(
  "/courses/create",
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data.token;
      const response = await axios.post(
        `${BASE_API_URL}/courses/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
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

export const createCourseSlice = createSlice({
  name: "Create Course Slice",
  initialState,
  reducers: {
    resetCreateCourseState: (state) => {
      state.data = {} as iCreatedCourseResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCourseFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedCourseResponse;
      state.error = "";
    });
    builder.addCase(createCourseFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createCourseFn.rejected, (state, action) => {
      state.data = {} as iCreatedCourseResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetCreateCourseState } = createCourseSlice.actions;
