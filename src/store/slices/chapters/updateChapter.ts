import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../constants/base_url";
import { Default_Error_Message } from "../../../constants/default_error";
import type { RootState } from "../../store";
import type {
  iUpdatedChapterPayload,
  iUpdatedChapterResponse,
} from "../../../types/chapter";

const initialState = {
  data: {} as iUpdatedChapterResponse,
  loading: false,
  error: "",
};

export const updateChapterFn = createAsyncThunk(
  "courses/chapters/update",
  async (data: iUpdatedChapterPayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;

      const response = await axios.put(
        `${BASE_API_URL}/courses/chapters/update`,
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

export const updateChapterSlice = createSlice({
  name: "Update Chapter Slice",
  initialState,
  reducers: {
    resetUpdateChapterState: (state) => {
      state.data = {} as iUpdatedChapterResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateChapterFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedChapterResponse;
      state.error = "";
    });
    builder.addCase(updateChapterFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateChapterFn.rejected, (state, action) => {
      state.data = {} as iUpdatedChapterResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdateChapterState } = updateChapterSlice.actions;
