import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  iCreatedLessonPayload,
  iCreatedLessonResponse,
} from "../../../types/lesson";
import axios, { AxiosError } from "axios";
import { Default_Error_Message } from "../../../constants/default_error";
import { BASE_API_URL } from "../../../constants/base_url";

const initialState = {
  data: {} as iCreatedLessonResponse,
  loading: false,
  error: "",
};

export const createlessonFn = createAsyncThunk(
  "/lesson/create",
  async (data: iCreatedLessonPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/courses/lessons/create`,
        data
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

export const createLessonSlice = createSlice({
  name: "Create Lesson Slice",
  initialState,
  reducers: {
    resetLessonState: (state) => {
      state.data = {} as iCreatedLessonResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createlessonFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedLessonResponse;
      state.error = "";
    });
    builder.addCase(createlessonFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createlessonFn.rejected, (state, action) => {
      state.data = {} as iCreatedLessonResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetLessonState } = createLessonSlice.actions;
