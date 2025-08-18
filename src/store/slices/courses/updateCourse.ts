import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { iUpdatedCourseResponse } from "../../../types/course";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";

const initialState = {
  data: {} as iUpdatedCourseResponse,
  loading: false,
  error: "",
};

export const updateCourseFn = createAsyncThunk(
  "courses/update",
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;

      const response = await axios.put(
        `${BASE_API_URL}/courses/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

export const updateCourseSlice = createSlice({
  name: "updateCourseSlice",
  initialState,
  reducers: {
    resetUpdateCourseSlice: (state) => {
      state.data = {} as iUpdatedCourseResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCourseFn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateCourseFn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateCourseFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUpdateCourseSlice } = updateCourseSlice.actions;
export default updateCourseSlice.reducer;
