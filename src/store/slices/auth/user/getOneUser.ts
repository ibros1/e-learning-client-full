import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import type { iGetOneMember } from "../../../../types/members";
import { BASE_API_URL } from "../../../../constants/base_url";
import { Default_Error_Message } from "../../../../constants/default_error";

const initialState = {
  data: {} as iGetOneMember,
  loading: false,
  error: "",
};

export const getOneUserFn = createAsyncThunk(
  "/users/list/:userId",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/users/list/${userId}`);

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

export const getOneUserSLice = createSlice({
  name: "Get One user Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneUserFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iGetOneMember;
      state.error = "";
    });
    builder.addCase(getOneUserFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getOneUserFn.rejected, (state, action) => {
      state.data = {} as iGetOneMember;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});
