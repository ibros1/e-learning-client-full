import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { iDeletedChapterResponse } from "../../../types/chapter";

const initialState = {
  data: {} as iDeletedChapterResponse,
  loading: false,
  error: "",
};

export const deleteChapterFn = createAsyncThunk(
  "/courses/chapters/delete",
  async (chapterId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/courses/chapters/list/delete/${chapterId}`
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

export const deleteChapterSlice = createSlice({
  name: "delete Chapter Slice",
  initialState,
  reducers: {
    resetDeleteChapterState: (state) => {
      state.data = {} as iDeletedChapterResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteChapterFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeletedChapterResponse;
      state.error = "";
    });
    builder.addCase(deleteChapterFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(deleteChapterFn.rejected, (state, action) => {
      state.data = {} as iDeletedChapterResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetDeleteChapterState } = deleteChapterSlice.actions;
