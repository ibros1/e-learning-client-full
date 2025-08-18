import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import type { iListedMembersResponse } from "../../../../types/members";
import { BASE_API_URL } from "../../../../constants/base_url";
import { Default_Error_Message } from "../../../../constants/default_error";

const initialState = {
  data: {} as iListedMembersResponse,
  loading: false,
  error: "",
};

export const listUsersFn = createAsyncThunk(
  "/users/list",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/users/list/`);

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

export const listUsersSlice = createSlice({
  name: "List users Slice",
  initialState,
  reducers: {
    createUserRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateUserRedu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteUserRdu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listUsersFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedMembersResponse;
      state.error = "";
    });
    builder.addCase(listUsersFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listUsersFn.rejected, (state, action) => {
      state.data = {} as iListedMembersResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { createUserRedu, updateUserRedu, deleteUserRdu } =
  listUsersSlice.actions;
