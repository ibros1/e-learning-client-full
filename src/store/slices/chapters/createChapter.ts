import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";
import type {
  iCreatedChapterPayload,
  iCreatedChapterResponse,
} from "../../../types/chapter";

const initialState = {
  data: {} as iCreatedChapterResponse,
  loading: false,
  error: "",
};

export const createChapterFn = createAsyncThunk(
  "/courses/chapters/create",
  async (data: iCreatedChapterPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data.token;
      const response = await axios.post(
        `${BASE_API_URL}/courses/chapters/create`,
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

export const createChapterSlice = createSlice({
  name: "Create Chapter Slice",
  initialState,
  reducers: {
    resetChapterState: (state) => {
      state.data = {} as iCreatedChapterResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChapterFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iCreatedChapterResponse;
      state.error = "";
    });
    builder.addCase(createChapterFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createChapterFn.rejected, (state, action) => {
      state.data = {} as iCreatedChapterResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetChapterState } = createChapterSlice.actions;
