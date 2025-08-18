import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";

import type {
  iUpdatedLessonPayload,
  iUpdatedLessonResponse,
} from "../../../types/lesson";

const initialState = {
  data: {} as iUpdatedLessonResponse,
  loading: false,
  error: "",
};

export const updateLessonFn = createAsyncThunk(
  "courses/chapters/update",
  async (data: iUpdatedLessonPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;

      const response = await axios.put(
        `${BASE_API_URL}/courses/lessons/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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

export const updateLessonSlice = createSlice({
  name: "Update lesson Slice",
  initialState,
  reducers: {
    resetUpdateLessonState: (state) => {
      state.data = {} as iUpdatedLessonResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateLessonFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedLessonResponse;
      state.error = "";
    });
    builder.addCase(updateLessonFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateLessonFn.rejected, (state, action) => {
      state.data = {} as iUpdatedLessonResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdateLessonState } = updateLessonSlice.actions;
